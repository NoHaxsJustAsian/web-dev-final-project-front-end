import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from "../supabaseClient";
import { UserResponse } from '@supabase/supabase-js';

type UserData = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: string;
    liked_posts: string[];
    selling_posts: string[];
    profileURL: string;
  }

const CreateProduct = () => {
    const [title, setTitle] = useState('');
    const [user, setUser] = useState<UserResponse | null>(null);

    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [userId, setUserId] = useState<UserData | null>(null);
    const [imgUrl, setImgUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await supabase.auth.getUser();

            if (!currentUser) {
                navigate('/login');
            } else {
                setUser(currentUser);
            }
        };

        fetchUser();
        setUserId(userId);
    }, [navigate]);
  
    
    const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('User data', user)
        if (!userId) {
            console.error('No user information available');
            return;
        }

        const { data: productData, error: productError } = await supabase
        .from('posts')
        .insert([
            { title, description, price, img_url: imgUrl, user_id: userId.id, created_at: new Date().toISOString() }
        ]);
        
        if (productError) {
            alert('Error creating product: ' + productError.message);
            return;
        }
    
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('selling_posts')
            .eq('id', userId.id)
            .single();
    
        if (profileError || !userProfile) {
            console.error('Error fetching user profile:', profileError);
            return;
        }
        if (!productData) {
            console.error('Error fetching product data:', productError);
            return;
        }
        const updatedSellingPosts = [...userProfile.selling_posts, (productData as any)[0].id];
        const { error: updateError } = await supabase
            .from('users')
            .update({ selling_posts: updatedSellingPosts })
            .match({ id: userId.id });
    
        if (updateError) {
            console.error('Error updating selling posts:', updateError);
        } else {
            alert('Product created and profile updated successfully!');
            navigate('/'); 
        }
    };
    

    return (
        <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="flex flex-col">
                <label
                  htmlFor="title"
                  className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                >
                  <input
                    type="text"
                    id="title"
                    className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                  <span
                    className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                  >
                    Title
                  </span>
                </label>

                <label
                  htmlFor="description"
                  className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                >
                  <textarea
                    id="description"
                    className="peer h-24 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <span
                    className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                  >
                    Description
                  </span>
                </label>

                <label
                  htmlFor="price"
                  className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                >
                  <input
                    type="number"
                    id="price"
                    className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                    placeholder="Price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                  <span
                    className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                  >
                    Price
                  </span>
                </label>

                {/* Include more inputs as needed */}
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Create Product</button>
        </form>
    );
};

export default CreateProduct;