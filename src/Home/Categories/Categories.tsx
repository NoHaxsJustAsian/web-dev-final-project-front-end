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
    price: string;
    img_url: string;
    created_by: string; 
};

function Categories() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = supabase.auth.getUser();

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
        </>
    );
}

export default Categories;
