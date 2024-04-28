import { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Import supabase client
import { Navbar, NavDropdown, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { BsFillPersonFill, BsFillEnvelopeFill, BsFillPlusCircleFill } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoLogOut } from 'react-icons/io5';
import './Header.css';

function Header() {

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
    };

    const logoStyles = {
        height: 'auto',
        width: window.innerWidth > 768 ? '200px' : '150px',  // Adjust logo size based on screen width
    };

    return (
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
            <div className="container">
                <Navbar.Brand>
                    <NavLink to="/">
                        <img 
                            src={`${process.env.PUBLIC_URL}/logo-black-horizontal-crop.png`}
                            style={logoStyles} 
                            alt="Logo"
                        />
                    </NavLink>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto"></Nav>
                    {user && role !== 'buyer' ? (
                        <Nav>
                            <NavLink className="nav-item" id="addButton" to="/add-product">
    <OverlayTrigger key="bottom" placement="bottom"
        overlay={<Tooltip id={`tooltip-bottom`}><strong>Add</strong> a sell.</Tooltip>}>
        <BsFillPlusCircleFill size={35} />
    </OverlayTrigger>
</NavLink>
                            <NavDropdown title={<GiHamburgerMenu size={30} />} id="collapsible-nav-dropdown">
                                <NavLink className="dropdown-item" to="/profile">
                                    <BsFillPersonFill /> Profile
                                </NavLink>
                                <NavLink className="dropdown-item" to="/messages">
                                    <BsFillEnvelopeFill /> Messages
                                </NavLink>
                                <NavDropdown.Divider />
                                <NavLink className="dropdown-item" to="/" onClick={handleLogout}>
                                    <IoLogOut /> Log out
                                </NavLink>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav>
                            <NavLink className="nav-link" to="/login">Login</NavLink>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default Header;
