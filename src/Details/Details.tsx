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
    const [userRole, setUserRole] = useState("seller");
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<PostData | null>(null);
    const [reviews, setReviews] = useState<ReviewData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editPostData, setEditPostData] = useState<PostData | null>(null);

   
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
            navigate('/home'); 
          } catch (error) {
            console.log('Error deleting post:', error);
          } finally {
            setLoading(false);
          }
        }
      };
      const renderBuyerActions = () => (
        <>
          <button className="btn">Add to Cart</button>
          <button className="btn">Review Product</button>
        </>
      );
    
      const renderSellerActions = () => {
        return isEditing ? (
          <div>
            <input type="text" value={editPostData?.title} onChange={(e) => handleEditChange(e, 'title')} />
            <input type="text" value={editPostData?.description} onChange={(e) => handleEditChange(e, 'description')} />
            <input type="number" value={editPostData?.price} onChange={(e) => handleEditChange(e, 'price')} />
            <button onClick={saveChanges}>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <button onClick={() => { setEditPostData(post); setIsEditing(true); }}>Edit</button>
            <button className="btn btn-danger" onClick={handleDeletePost}>Delete</button>
          </>
        );
      };

    return (
        <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="md:flex md:items-start md:justify-between md:space-x-8">
            {post && post.image_url && (
              <div className="shrink-0">
                <img
                  className="h-64 w-64 object-cover rounded-md transition duration-300 ease-in-out transform group-hover:scale-110"
                  src={post.image_url}
                  alt={post.title}
                />
              </div>
            )}
      
            <div className="flex-1">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {post ? post.title : 'Product Name'}
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {post ? post.description : 'Product Description'}
              </p>

              <div className="actions">
              {userRole === 'seller' ? renderSellerActions() : renderBuyerActions()}
             </div>
              <p className="mt-2 text-right text-gray-900">
                {post ? `₹${parseFloat(post.price).toFixed(2)}` : 'Price'}
              </p>
              <p className="text-right text-sm text-gray-600">
                Created at: {post ? new Date(post.created_at).toLocaleDateString() : 'Date'}
              </p>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-rose-600 px-5 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-600 hover:text-white"
              >
                <span>Back to Products</span>
              </button>
            </div>
          </div>
      
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {reviews ? reviews.map(review => (
              <blockquote key={review.id} className="flex h-full flex-col justify-between rounded-lg border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div>
                  <p className="text-left text-2xl font-bold text-rose-600">{review.title}</p>
                  <p className="mt-4 text-left text-gray-700">{review.description}</p>
                </div>
                <footer className="mt-4 text-right">
                  <button
                    onClick={() => navigate(`/profile/${review.created_by}`)}
                    className="rounded bg-pink-100 px-3 py-1 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-200"
                  >
                    {review.created_by}
                  </button>
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