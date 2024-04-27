import { useEffect, useState } from 'react';
import { Col, Dropdown, Spinner } from 'react-bootstrap';
import { BiSortDown, BiSort, BiUpArrowAlt, BiSortUp, BiDownArrowAlt } from 'react-icons/bi';
import CategoriesNav from './CategoriesNav';
import { getAll } from '../../services/productData';
import { Product } from '../../services/types';
import ProductCard from '../../Product/ProductCard';
import { match } from 'assert';
import supabase from '../../supabaseClient';

function Categories() {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('oldest');

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('category', query)
                .order('id', { ascending: false }); 
    
            if (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            } else {
                setProducts(data);
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, [query]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setQuery(e.target.value);
    };

    return (
        <>
            <div id="sider">
                <input className="col-lg-6" type="text" placeholder="Search..." name="search" value={query} onChange={handleSearch} />
            </div>
            <CategoriesNav />
            <div className="container">
                <Dropdown id="dropdown-sort">
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        Sort <BiSort />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { setSort('oldest') }}>Oldest <BiDownArrowAlt /></Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSort('newest') }}>Newest <BiUpArrowAlt /></Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSort('lowerPrice') }}>Price <BiSortDown /></Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSort('biggerPrice') }}>Price <BiSortUp /></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {!loading ? (
                    <div className="row">
                        {products
                            .sort((a, b) => {
                                if (sort === "oldest") {
                                    return a.addedAt.localeCompare(b.addedAt);
                                }
                                if (sort === "newest") {
                                    return b.addedAt.localeCompare(a.addedAt);
                                }
                                if (sort === "lowerPrice") {
                                    return a.price - b.price;
                                }
                                if (sort === "biggerPrice") {
                                    return b.price - a.price;
                                }
                            })
                            .map(x => (
                                <Col xs={12} md={6} lg={3} key={x._id.toString()}>
                                    <ProductCard product={x} />
                                </Col>
                            ))}
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
