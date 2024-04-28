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
    user_id: string;
    img_url: string;
    price: number;
} | null;

function Details() {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<PostData[]>([]);

    const [userRole, setUserRole] = useState("seller"); // 'buyer' or 'seller'
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const [price, setPrice] = useState("");
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [detailsMode, setDetailsMode] = useState('view');
    const [details, setDetails] = useState({
      title: 'Win Tongtawee',
      description: 'Illicit Substance Fueled Machine(LLM)',
      price: '99999'
    });
    const [editedDetails, setEditedDetails] = useState(details);
    const handleLoginClick = () => {
        navigate('/login');
    };
    const handleHomeClick = () => {
        navigate('/home');
    };
    const handleProfileClick = () => {
        navigate('/profile');
    };
    const handleEditClick = () => {
        setDetailsMode('edit');
    };
    const handleCreateClick = () => {
        setDetailsMode('create');
    };

    useEffect(() => {
        const fetchPostDetails = async () => {
            setLoading(true);
            console.log("Fetching details for postId:", postId);

            try {
                const postIdNumber = Number(postId);
                if (isNaN(postIdNumber)) {
                    throw new Error("Invalid post ID format");
                }

                let { data, error, status } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', postIdNumber)


                console.log("Response data:", data);

                if (error && status !== 406) {
                    console.error("Supabase error:", error);
                    throw error;
                }

                if (data) {
                    setPost(data);
                } else {
                    setError('Post not found.');
                }

            } catch (error) {
                console.error('Error fetching post details:', error);
                setError(`Failed to fetch post: ${(error as Error).message || (error as Error).toString()}`);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPostDetails();
        }
    }, [postId]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found.</div>;
    const postInfo = post[0];



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedDetails({ ...editedDetails, [name]: value });
      };
    const saveDetails = () => {
        setDetails(editedDetails);
        setDetailsMode('view');
    };
    const changeFormMode = (mode: string) => {
        setDetailsMode(mode);
    };

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


    const Header = ({ userRole, changeFormMode }: { userRole: string, changeFormMode: (mode: string) => void }) => {
        return (
            <div className="header">
                <nav className="menu">
                    {/* ... other menu items ... */}

                    <button onClick={handleLoginClick}>
                        Home
                    </button>
                    <button onClick={handleLoginClick}>
                        Search
                    </button>
                    <button onClick={handleProfileClick}>
                        Profile
                    </button>
                    <button className="login-button" onClick={handleLoginClick}>
                        Login
                    </button>

                    {userRole === 'seller' && (
                        <button className="create-button" onClick={() => changeFormMode('create')}>Create</button>
                    )}
                </nav>
            </div>
        );
    };
    const ProductScreen = ({ userRole, changeFormMode }: { userRole: string, changeFormMode: (mode: string) => void }) => {
        return (
            <>
                <div className="product-section">
                    <div className="image-container">
                        {/* Image will go here */}
                    </div>

                    <div className="product-details">
                        {ProductDetails({ details, handleInputChange, saveDetails })} 
                        {userRole === 'seller' && (
                            <>
                                <button className="edit-button" onClick={handleEditClick}>
                                    Edit
                                </button>
                                {/* logic needs fix */}
                                <button className="delete-button" onClick={() => changeFormMode('delete')}>
                                    Delete
                                </button>
                            </>
                        )}

                    </div>
                </div>

            </>
        );
    };

    const ProductDetails = ({ details, handleInputChange, saveDetails }: { details: any, handleInputChange: any, saveDetails: any }) => {
        if (detailsMode === 'edit') {
            return (
                <ProductDetails
                    details={editedDetails}
                    handleInputChange={handleInputChange}
                    saveDetails={saveDetails}
                />
            );
        }
        else {
            return (
                <div className="product-details-container">
                    <input
                        type="text"
                        placeholder="Win Tongtawee"
                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    <input
                        type="Description"
                        placeholder="Illicit Substance Fueled Machine(LLM)"
                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="price"
                        placeholder="99999"
                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <button onClick={saveDetails}>Save</button>
                </div>
            );
        }
    }
    const renderProductDetails1 = () => {
        if (detailsMode === 'edit') {
            return (
                <ProductDetails
                    details={editedDetails}
                    handleInputChange={handleInputChange}
                    saveDetails={saveDetails}
                />
            );
        } else {
            return (
                <div className="product-container">
                    <div className="product-image-container">
                        <div className="product-image">800 x 600</div>
                    </div>
                    <div className="product-details-container">
                        <div className="detail">
                            <strong>Product Name:</strong> {postInfo?.title}
                        </div>
                        <div className="detail">
                            <strong>Description:</strong> {postInfo?.description}
                        </div>
                        <div className="product-price">
                            <strong>Price:</strong> {postInfo?.price}
                        </div>
                    </div>
                </div>
            );
        }
    };





    const incrementQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <div className="container">
            {Header({ userRole, changeFormMode })}
            <div className="product-details">
                {ProductScreen({ userRole, changeFormMode })}

                <div className="quantity-selector">
                    <button onClick={decrementQuantity}>-</button>
                    <span>{quantity}</span>
                    <button onClick={incrementQuantity}>+</button>
                </div>
                <button className="button">Add to Cart</button>
            </div>
            <footer className="footer">
                Additional Reviews
            </footer>
        </div>
    );
}

export default Details;
