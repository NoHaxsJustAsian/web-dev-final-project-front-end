import { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import {useLocation, Link, useNavigate } from 'react-router-dom';

import './Header.css';

function Header() {
    const nav = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null); // New state for role

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: authUser, error: authError } = await supabase.auth.getUser();
    
                if (authError) {
                    console.error('Error fetching auth user:', authError);
                    return;
                }
    
                if (authUser) {
                    const { data: user, error } = await supabase
                        .from('users')
                        .select('role')
                        .eq('id', authUser.user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching user role:', error);
                    } else if (user) {
                        setUser(authUser);
                        setRole(user.role);
                    }
                } else {
                    console.error("No user found");
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
    
        fetchData();
    }, []);
    
    if (location.pathname === '/login') {
        return null;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        nav('/');
    };

    return (
        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" to="/">
                <img
                    src="/logo-black-horizontal-crop.png"
                    alt="Logo"
                    style={{
                        height: '100%',
                        maxWidth: '200px',
                        objectFit: 'contain',
                    }}
                    className="justify-left"
                />
                </Link>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            {user && (
                <>
                    <Link className="mr-5 hover:text-gray-900" to="/profile">Profile</Link>
                    {role === 'buyer' && <Link className="mr-5 hover:text-gray-900" to="/add-product">Add Product</Link>}
                    <button 
                    type="button" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                    onClick={handleLogout}
                >
                    Log out
                </button>
                </>
            )}
            {!user && <button 
                        type="button" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                        onClick={() => nav('/login')}
                    >
                        Login
                    </button>}
        </nav>
            </div>
        </header>
    );
};

export default Header;
