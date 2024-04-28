import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import supabase from "../supabaseClient";
import { UserResponse } from '@supabase/supabase-js';
import axios from 'axios';
// import ProfilePage from '../Profile/Profile';
import './Details.css';
import ReviewList from '../Review/ReviewListPost';
import ReviewForm from '../Review/ReviewForm';

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

type ReviewData = {
    id: number;
    title: string;
    description: string;
    user_id: number;
    created_by: string; 
};

type Review = {
    timestamp: string;
    description: string;
    title: string;
    userid: string;
    postid: number;
    username: string;
};

type User = {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: string;
    reviews: string[];
    selling_posts: string[];
    profileURL: string;
};

type ReviewProps = {
    reviewIds: string[];
};

function Details() {
    const [reviewsData, setReviewsData] = useState<Review[]>([]);
    const [profile, setProfile] = useState<User>();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [userRole, setUserRole] = useState("");
    const { postId } = useParams<{ postId: string }>();
    const postIdNumber = Number(postId);
    const { userName } = useParams();
    const [post, setPost] = useState<PostData | null>(null);
    const [reviews, setReviews] = useState<ReviewData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editPostData, setEditPostData] = useState<PostData | null>(null);
    const [quantity, setQuantity] = useState(1);


    useEffect(() => {
      const fetchUser = async () => {
          try {
              await supabase.auth.getUser()
                  .then(currentUser => {
                      setUser(currentUser);
  
                      if (!currentUser) {
                          navigate('/login');
                      }
                  });
          } catch (error) {
              console.error('Error fetching user:', error);
          }   
      };
      fetchUser();
  }, [navigate]);
  useEffect(() => {
    const fetchProfileAndReviews = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                throw error;
            }

            if (user) {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    throw error;
                }

                setUser(data);
            }

            if (user) {
                const { data: reviews, error: reviewsError } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('postid', user.id);

                if (reviewsError) {
                    throw reviewsError;
                }

                setReviewsData(reviews);
            }
        } catch (error) {
            console.error('Error fetching profile and reviews:', error);
        }
    };

    fetchProfileAndReviews();
}, []);

   
      
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);

                const { data: postData, error: postError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', postId)
                    .single();
    
                if (postError) throw new Error(postError.message);
                console.log('Post data:', postData);
                setPost(postData);

                const { data: reviewData, error: reviewError } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('id', postId);
    
                    if (reviewError) throw new Error(reviewError.message);
                    setReviews(reviewData);  
                    console.log("Reviews:", reviewData);
                    console.log('Image URL:', postData?.image_url);
                const { data: { user }, error } = await supabase.auth.getUser();
                  if (error) {
                      throw error;
                  }
      
                  if (user) {
                      const { data: userData, error } = await supabase
                          .from('users')
                          .select('*')
                          .eq('id', user.id)
                          .single();
      
                      if (error) {
                          throw error;
                      }
      
                      setUserRole(userData.role);
                  }   
                  
                } catch (err) {
                    console.error('Error fetching profile:', error);
                } finally {
                    setLoading(false);
                }
        };
    
        fetchDetails();
    }, [postId]);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found.</div>;


    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setEditPostData({ ...editPostData, [field]: e.target.value } as PostData);
      };

      const saveChanges = async () => {
        if (!editPostData) return;
        try {
          const { data, error } = await supabase
            .from('posts')
            .update({ ...editPostData })
            .eq('id', postId);
    
          if (error) throw error;
          
          setPost(editPostData);
          setIsEditing(false);
        } catch (error) {
          console.log('Error updating post:', error);
        }
      };

      const handleDeletePost = async () => {
        if (!postId) return;
        
        if (window.confirm('Are you sure you want to delete this post?')) {
          try {
            setLoading(true);
            const { data, error } = await supabase
              .from('posts')
              .delete()
              .eq('id', postId);

            if (error) throw error;
            console.log('Post deleted:', data);
            navigate('/dashboard'); 
          } catch (error) {
            console.log('Error deleting post:', error);
          } finally {
            setLoading(false);
          }
        }
      };

      
      const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
      };
    const decrementQuantity = () => {
      setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };
   
      const renderBuyerActions = () => {
        return (
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center gap-1">
              <button type="button" className="text-gray-600 transition hover:opacity-75" onClick={decrementQuantity}>
                &minus;
              </button>
              <input
                type="number"
                id="Quantity"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value))}
                className="h-10 w-24 rounded border-gray-200 text-center sm:text-sm"
                min="1"
              />
              <button type="button" className="text-gray-600 transition hover:opacity-75" onClick={incrementQuantity}>
                +
              </button>
            </div>
            <button className={commonButtonStyle} onClick={addToCart}>Add to Cart</button>
          </div>
        );
      };
      
      const renderSellerActions = () => {
        return isEditing ? (
          <div>
           <div>
              <input
                type="text"
                value={editPostData?.title}
                onChange={(e) => handleEditChange(e, 'title')}
                className="mb-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                placeholder="Title"
              />
              <input
                type="text"
                value={editPostData?.description}
                onChange={(e) => handleEditChange(e, 'description')}
                className="mb-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                placeholder="Description"
              />
              <input
                type="number"
                value={editPostData?.price}
                onChange={(e) => handleEditChange(e, 'price')}
                className="mb-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                placeholder="Price"
              />
            </div>

            <button className="mb-2 rounded bg-pink-100 px-3 py-1 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-200" onClick={saveChanges}>Save Changes</button>
            <br />
            <button className="mb-2 rounded bg-pink-100 px-3 py-1 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-200" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
            <button
              onClick={() => { setEditPostData(post); setIsEditing(true); }}
              className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative"
              title="Edit Product"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
      
            <button
              onClick={handleDeletePost}
              className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
              title="Delete Product"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </span>
        );
      };
      
      const renderActions = () => {
        return (
          <>
           {renderBuyerActions()}
            {userRole === 'seller' && renderSellerActions()}
          </>
        );
      };
      const addToCart = () => {
      
        if (userRole !== 'buyer' && userRole !== 'seller') {
          navigate('/login');
          return;
        }
        alert('Added to cart: ' + quantity); 
        console.log('Added to cart:', quantity);
      };


      const goBackToDashboard = () => {
        navigate('/');
    };

      const commonButtonStyle = "inline-flex items-center justify-center gap-2 rounded-full border border-rose-600 px-5 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-600 hover:text-white";
      return (
        <div>
        <section className="bg-gray-50">
            <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 bg-blue-100">
                <div className="md:flex md:items-start md:justify-between md:space-x-8">
                    <div className="flex-1">
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            {post ? post.title : 'Product Name'}
                        </h2>
                        <p className="mt-4 text-gray-700 leading-relaxed">
                            {post ? post.description : 'Product Description'}
                        </p>
                        <div className="shrink-0">
                            <img
                              
                                src={post.img_url}
                                alt={post.title}
                            />
                        </div>
                      
                        <p className="mt-2 text-left text-gray-900">
                            {post ? `₹${parseFloat(post.price).toFixed(2)}` : 'Price'}
                        </p>
                        <p className="text-left text-sm text-gray-600">
                            Created at: {post ? new Date(post.created_at).toLocaleDateString() : 'Date'}
                        </p>
                        <p className="text-left text-sm text-gray-600">
                            Seller: {post ? post.created_by : 'Seller'}
                        </p>
                        {renderActions()}
                        <div className="mt-4 flex justify-end items-end space-x-2">
                        </div>
                        <button onClick={goBackToDashboard} className={commonButtonStyle}>
                            <span>Back to Products</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <ReviewList postid={postIdNumber} />
        <ReviewForm postid={postIdNumber} />
        </div>
    );
}

export default Details;
