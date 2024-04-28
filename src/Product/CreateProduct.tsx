import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from "../supabaseClient";
import { UserResponse } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

type UserData = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  liked_posts: string[];
  seller_posts: string[];
  profileURL: string;
}

type PostData = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  user_id: number;
  price: string;
  img_url: string;
  created_by: string;
};



const CreateProduct = () => {
  const [title, setTitle] = useState('');

  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [userId, setUserId] = useState<null | string>(null);
  const [imgURL, setImgURL] = useState("");
  const [error, setError] = useState("");
  const [post, setPost] = useState<PostData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      const { data: userRoleData } = await supabase.from('users').select('role').eq('id', userId).single();
      if (user && userRoleData?.role === 'seller') {
        setUserId(user?.id);
      }
      console.log('user', userId);
    }

    fetchUser();
    setUserId(userId);
  }, [navigate]);

  const productData = {
    title,
    description,
    price: parseFloat(price),
    img_url: "",
    user_id: userId,
    created_at: new Date().toISOString()
  };
      const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            await uploadFile(file);
        }
    };
    const uploadFile = async (file: File) => {
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      if (fileExtension !== "jpg" && fileExtension !== "png") {
        setError("Only JPEG and PNG files are allowed.");
        return;
    }
    const fileName = `${timestamp}.${fileExtension}`;
    const filePath = `photos_pictures/${fileName}`;
    const { data, error } = await supabase.storage.from('photos').upload(filePath, file);
    if (error) {
        console.error('Error uploading file:', error);
    } else {
        console.log('File uploaded successfully');
        const { data: urlData} = supabase.storage.from('photos').getPublicUrl(filePath);
            console.log('File URL:', urlData.publicUrl);
            setImgURL(urlData.publicUrl);
    } 
  };
  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      console.error('No user information available');
      return;
    }

    const { data: maxIdData, error: maxIdError } = await supabase
      .from('posts')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (maxIdError) {
      console.error('Failed to fetch max id:', maxIdError.message);
      return;
    }

    const nextId = maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;
    const numericPrice = parseFloat(price);
    const { data: productData, error: productError } = await supabase
      .from('posts')
      .insert([
        { id: nextId, title, description, price: numericPrice, img_url: imgURL, user_id: userId, created_at: new Date().toISOString() }
      ])
      .select();


    if (productError) {
      alert('Error creating product: ' + productError.message);
      return;
    }

    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('seller_posts')
        .eq('id', userId)
        .single();

    if (profileError || !userProfile) {
      console.error('Error fetching user profile:', profileError);
      return;
    }
    if (!productData) {
      console.error('Error fetching product data:', productError);
      return;
    }
    // const updatedSellingPosts = [...(userProfile.seller_posts || []), (productData as any)[0].id];
    // const { error: updateError } = await supabase
    //   .from('users')
    //   .update({ selling_posts: updatedSellingPosts })
    //   .match({ id: userId });

    // if (updateError) {
    //   console.error('Error updating selling posts:', updateError);
    // } else {
      alert('Product created and profile updated successfully!');
      navigate('/');
    // }
  };


  return (


    <section className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <a className="block text-blue-600" href="#">
          <span className="sr-only">Home</span>
          <svg className="h-8 sm:h-10" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41Z"
              fill="currentColor"
            />
          </svg>
        </a>

        <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Create a Product
        </h1>

        <form onSubmit={handleCreateProduct} className="mt-8 grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="col-span-6 md:col-span-3">
            <label htmlFor="Title" className="block text-sm font-medium text-white">Title</label>
            <input
              type="text"
              id="Title"
              name="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6 md:col-span-3">
            <label htmlFor="Description" className="block text-sm font-medium text-white">Description</label>
            <input
              type="text"
              id="Description"
              name="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="Price" className="block text-sm font-medium text-white">Price</label>
                        <input
                            type="number"
                            id="Price"
                            name="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                        />
                    </div>

          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="Image" className="block text-sm font-medium text-white">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>
          <div className="col-span-6 flex justify-center">
            <button type="submit" className="rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
              Create Product
            </button>
          </div>
        </form>
      </div>
      
    </section>
    

  );
};

export default CreateProduct;