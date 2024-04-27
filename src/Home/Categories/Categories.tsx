import { useEffect, useState } from 'react';
import { Col, Dropdown, Spinner } from 'react-bootstrap';
import { BiSortDown, BiSort, BiUpArrowAlt, BiSortUp, BiDownArrowAlt } from 'react-icons/bi';
import CategoriesNav from './CategoriesNav';
import { getAll } from '../../services/productData';
import { Product } from '../../services/types';
import ProductCard from '../../Product/ProductCard';
import { match } from 'assert';

function Categories() {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('oldest');

    useEffect(() => {
        setLoading(true);
        const allProducts = async () => {
            try {
                const res = await getAll(query);
                
                } catch (err) {
            console.log('Error fetching products');
        }
    };
    if (res){
        setProducts(res);
        setLoading(false);
    }

        getAll(query)  
            .then(res => {
                setProducts(res);
                setLoading(false);
            })
            .catch(err => {
                console.log('Error fetching products:', err);
                setLoading(false);
            });
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
