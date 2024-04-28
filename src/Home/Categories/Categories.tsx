import { useEffect, useState } from 'react';
import { Button, Col, Dropdown, InputGroup, Spinner } from 'react-bootstrap';
import { BiSortDown, BiSort, BiUpArrowAlt, BiSortUp, BiDownArrowAlt } from 'react-icons/bi';
import CategoriesNav from './CategoriesNav';
import { getAll } from '../../services/productData';
import { Product } from '../../services/types';
import ProductCard from '../../Product/ProductCard';
import { match } from 'assert';
import supabase from '../../supabaseClient';
import { Form, useNavigate } from 'react-router-dom';

type PostData = {
    id: number;
    created_at: string;
    title: string;
    description: string;
    user_id: number;
    price: number;
    img_url: string;
    created_by: string; 
};

type CartData = {
    user_id: number;
    posts: number[];
};

function Categories() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [cart, setCart] = useState<PostData[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [userId, setUserId] = useState<null | string>(null);

    useEffect(() => {
        const fetchPosts = async () => {
        setLoading(true);
            let queryBuilder = supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (query) {
                queryBuilder = queryBuilder.ilike('title', `%${query}%`);
            }

            const { data, error } = await queryBuilder;

            if (error) {
                console.error('Error fetching products:', error);
                setPosts([]);
                } else {
                setPosts(data);
                }
                setLoading(false);
        };

        fetchPosts();

        const fetchUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            const userId = user?.id;
            const {data: userRoleData} = await supabase.from('users').select('role').eq('id', userId).single();
            if (user && userRoleData?.role === 'buyer') {
                setUserId(user?.id);
            }
            console.log('user', userId);
        }

        fetchUser();

        //fetches cart if user leaves

        const fetchCart = async () => {
            const { data: cartData, error } = await supabase.from('cart').select('*').eq('user_id', userId);
            if (cartData) {
                setCart(cartData);
                const postIds = cartData[0].posts;
                const total = postIds.reduce((acc: number, id: number) => {
                    const post = posts.find(post => post.id === id);
                    return acc + (post ? post.price : 0);
                }, 0);
                setTotalPrice(total);
        
            }
        }

        fetchCart();
    }, [query]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        setQuery(query);
    };

    const handleReset = () => {
        setQuery('');
    };

    const handleAddPost = (id: number, price: number) => {
        const post = posts.find(post => post.id === id);
        if (post) {
            setCart([...cart, post]);
        }
        setTotalPrice(totalPrice + price);
    }

    const handleRemovePost = (id: number) => {
        const post = posts.find(post => post.id === id);
        
        if (post) {
            setCart(cart.filter(post => post.id !== id));
            setTotalPrice(totalPrice - post.price);
        }
    }

    const handleCheckout = async (cart: PostData[], userId: string) => {
        const {data: cartData} = await supabase
            .from('cart')
            .insert({ user_id: userId, posts: cart });
        
        const postIds = posts.map(post => post.id);
        const { data: deletedPosts } = await supabase
            .from('posts')
            .delete()
            .in('id', postIds);
        setCart([]);
        setPosts([]);
        setTotalPrice(0);
    }


    return (
        <>
            <div id="sider">
                <InputGroup className="mb-3">
                <input className="col-lg-6" type="text" placeholder="Search..." name="search" value={query} onChange={handleSearchChange} />
                    <Button variant="outline-secondary" onClick={handleSearch}>Search</Button>
                    <Button variant="outline-danger" onClick={handleReset}>Reset</Button>
                   
                </InputGroup>
            </div>
            <div className="container">
                <p className="text-2xl font-bold">Here are your Posts</p>
                
                {!loading ? (
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                      <thead className="text-left">
                        <tr>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ID</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Created At</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Description</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Seller ID</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Image</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Seller Name</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Price</th>
                          <th className="px-4 py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {posts.map(post => (
                          <tr key={post.id}>
                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{post.id}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{new Date(post.created_at).toLocaleDateString()}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{post.title}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{post.description}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{post.user_id}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700"><img src={post.img_url} alt={post.title} style={{ width: '50px', height: 'auto' }} /></td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{post.created_by}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">₹{post.price}</td>
                            <td className="whitespace-nowrap px-4 py-2">
                              <button
                                className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                onClick={() => navigate(`/details/${post.id}`)}>
                                View Details
                              </button>
                            </td>
                            {userId && (
                            <td>
                                
                                <button 
                                className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                    onClick={async () => {
                                    try {
                                        await handleAddPost(post.id, post.price);
                                    } catch (err) {
                                        console.log('error adding item');
                                    }
                                    }}>
                                    Add
                                </button>
                                </td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                ) : (
                    <div className="spinner">
                        <Spinner animation="border" />
                    </div>
                )}
            </div>
            {userId && (
            <div className='container'>
            <p className="text-2xl font-bold">Cart</p>
                    {cart && (
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                  <thead className="text-left">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Item Name</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cart
                        .map((post: PostData) => (
                          <tr key={post.id}>
                            <td>{post.title}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{post.price}</td>
                            <td className="whitespace-nowrap px-4 py-2">
                            <button
                                className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                 onClick={() => handleRemovePost(post.id)}>Return</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                
                </div>
              )}
              <p>
                Total Price: ₹{totalPrice}
              </p>
               
                <button 
                  className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  onClick={async () => {
                    
                    try {
                        await handleCheckout(cart, userId);
                        alert('Checkout successful!');
                      } catch (error) {
                        alert(`Checkout failed`);
                      }
                  }}>
                  Checkout
                </button>

            </div>
                   
            )}
        </>
    );
}

export default Categories;
