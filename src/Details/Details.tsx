import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import supabase from "../supabaseClient";
import axios from 'axios';
import './Details.css';

type PostData = {
    id: number;
    created_at: string;
    title: string;
    description: string;
    user_id: number;
    price: string;
    image_url: string;
    created_by: string; 
};

type ReviewData = {
    id: number;
    title: string;
    description: string;
    user_id: number;
    created_by: string; 
};

function Details() {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<PostData | null>(null);
    const [reviews, setReviews] = useState<ReviewData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                // Fetching product details
                const { data: postData, error: postError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', postId)
                    .single();
    
                if (postError) throw new Error(postError.message);
                console.log('Post data:', postData);
                setPost(postData);
    
                // Fetching reviews related to the product
                const { data: reviewData, error: reviewError } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('id', postId);
    
                    if (reviewError) throw new Error(reviewError.message);
                    setReviews(reviewData);  // Now correctly expects an array
                    console.log("Reviews:", reviewData);
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
    
    return (
        <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="md:flex md:items-start md:justify-between">
            
            {post && post.image_url && (
              <a href="#" className="group relative block overflow-hidden flex-shrink-0 mr-8">
                <button
                  className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75"
                >
                  <span className="sr-only">Wishlist</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
                <img
                  className="h-48 w-48 object-cover rounded-md transition duration-500 group-hover:scale-105"
                  src={post.image_url}
                  alt={post.title}
                />
              </a>
            )}
      
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {post ? post.title : 'Product Name'}
              </h2>
              <p className="mt-6 max-w-lg leading-relaxed text-gray-700">
                {post ? post.description : 'Product Description'}
              </p>
              <p className="text-gray-900">
                Price: {post ? `Rs. ${post.price}` : 'Price'}
              </p>
              <p className="text-gray-600">
                Created at: {post ? post.created_at : 'Date'}
              </p>
              <button
                onClick={() => navigate(-1)}
                className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full border border-rose-600 px-5 py-3 text-rose-600 transition hover:bg-rose-600 hover:text-white md:mt-0"
              >
                <span className="font-medium">Back to Products</span>
              </button>
            </div>
          </div>
      
          {/* Reviews Grid */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {reviews ? reviews.map(review => (
              <blockquote key={review.id} className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8">
                <div>
                  <p className="text-2xl font-bold text-rose-600 sm:text-3xl">{review.title}</p>
                  <p className="mt-4 leading-relaxed text-gray-700">{review.description}</p>
                </div>
                <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
                  &mdash; <Link to={`/profile/${review.created_by}`}>{review.created_by}</Link>
                </footer>
              </blockquote>
            )) : (
              <p className="text-gray-700">No reviews available.</p>
            )}
          </div>
        </div>
      </section>      
      
    );
    
}

export default Details;

// function Details() {
//     const { postId } = useParams<{ postId: string }>();
//     const [post, setPost] = useState<PostData[]>([]);

//     const [userRole, setUserRole] = useState("seller"); // 'buyer' or 'seller'
//     const [reviews, setReviews] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [quantity, setQuantity] = useState(1);
//     const navigate = useNavigate();
//     const [price, setPrice] = useState("");
//     const [productName, setProductName] = useState("");
//     const [description, setDescription] = useState("");
//     const [detailsMode, setDetailsMode] = useState('view');

//     const handleLoginClick = () => {
//         navigate('/login');
//     };
//     const handleHomeClick = () => {
//         navigate('/home');
//     };
//     const handleProfileClick = () => {
//         navigate('/profile');
//     };
//     const handleEditClick = () => {
//         setDetailsMode('edit');
//     };
//     const handleCreateClick = () => {
//         setDetailsMode('create');
//     };

//     const ProductDetails = ({ postId }: { postId: string }) => {
//         const [postInfo, setPostInfo] = useState(null);
//         const [loading, setLoading] = useState(false);
//         const [error, setError] = useState(null);
    
//         useEffect(() => {
//             const fetchPostDetails = async () => {
//                 setLoading(true);
//                 console.log("Fetching details for postId:", postId);
    
//                 try {
//                     const postIdNumber = Number(postId);
//                     if (isNaN(postIdNumber)) {
//                         throw new Error("Invalid post ID format");
//                     }
    
//                     const { data, error, status } = await supabase
//                         .from('products')
//                         .select('*')
//                         .eq('id', postIdNumber);
    
//                     if (data) {
//                         setPostInfo(data[0]); // Assuming the query returns at least one result
//                     } else {
//                         setError(null);
//                     }
//                 } catch (error) {
//                     console.error('Error fetching post details:', error);
//                     console.error("No user found");
//                 } finally {
//                     setLoading(false);
//                 }
//             };
    
//             if (postId) {
//                 fetchPostDetails();
//             }
//         }, [postId]);
//         return (
//             <div className="product-details-container">
//                 <div>Created at: {postInfo?.created_at}</div>
//                 <div>Description: {postInfo.description}</div>
//                 <div>ID: {postInfo.id}</div>
//                 <div>Name: {postInfo.name}</div>
//                 <div>Price: {postInfo.price}</div>
//             </div>
//         );
//     };
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;
//     if (!post) return <div>Post not found.</div>;
  



   
//     const changeFormMode = (mode: string) => {
//         setDetailsMode(mode);
//     };

    // const renderModeButtons = () => {
    //     if (userRole === 'seller') {
    //         return (
    //             <>
    //                 <button onClick={() => setDetailsMode('create')}>Create Mode</button>
    //                 <button onClick={() => setDetailsMode('view')}>View Mode</button>
    //                 <button onClick={() => setDetailsMode('edit')}>Edit Mode</button>
    //                 <button onClick={() => setDetailsMode('delete')}>Delete Mode</button>
    //             </>
    //         );
    //     } else if (userRole === 'buyer') {
    //         return (
    //             <button onClick={() => setDetailsMode('view')}>View Mode</button>
    //         );
    //     }
    // };


//     const Header = ({ userRole, changeFormMode }: { userRole: string, changeFormMode: (mode: string) => void }) => {
//         return (
//             <div className="header">
//                 <nav className="menu">
//                     {/* ... other menu items ... */}

//                     <button onClick={handleLoginClick}>
//                         Home
//                     </button>
//                     <button onClick={handleLoginClick}>
//                         Search
//                     </button>
//                     <button onClick={handleProfileClick}>
//                         Profile
//                     </button>
//                     <button className="login-button" onClick={handleLoginClick}>
//                         Login
//                     </button>

//                     {userRole === 'seller' && (
//                         <button className="create-button" onClick={() => changeFormMode('create')}>Create</button>
//                     )}
//                 </nav>
//             </div>
//         );
//     };
//     const ProductScreen = ({ userRole, changeFormMode }: { userRole: string, changeFormMode: (mode: string) => void }) => {
//         return (
//             <>
//                 <div className="product-section">
//                     <div className="image-container">
//                         {/* Image will go here */}
//                     </div>

//                     <div className="product-details">
//                     <div>Created at: {postInfo.created_at}</div>
//                     <div>Description: {postInfo.description}</div>
//                     <div>ID: {postInfo.id}</div>
//                     <div>Name: {postInfo.name}</div>
//                     <div>Price: {postInfo.price}</div>
//                         {userRole === 'seller' && (
//                             <>
//                                 <button className="edit-button" onClick={handleEditClick}>
//                                     Edit
//                                 </button>
//                                 {/* logic needs fix */}
//                                 <button className="delete-button" onClick={() => changeFormMode('delete')}>
//                                     Delete
//                                 </button>
//                             </>
//                         )}
//                     </div>
//                 </div>

//             </>
//         );
//     };


  



//     const incrementQuantity = () => {
//         setQuantity((prevQuantity) => prevQuantity + 1);
//     };

//     const decrementQuantity = () => {
//         setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
//     };

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;
//     return (
//         <div className="container">
//             {Header({ userRole, changeFormMode })}
//             <div className="product-details">
//                 {ProductScreen({ userRole, changeFormMode })}

//                 <div className="quantity-selector">
//                     <button onClick={decrementQuantity}>-</button>
//                     <span>{quantity}</span>
//                     <button onClick={incrementQuantity}>+</button>
//                 </div>
//                 <button className="button">Add to Cart</button>
//             </div>
//             <footer className="footer">
//                 Additional Reviews
//             </footer>
//         </div>
//     );
// }

// export default Details;