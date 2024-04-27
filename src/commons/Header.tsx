import { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Import supabase client
import { Navbar, NavDropdown, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BsFillPersonFill, BsFillEnvelopeFill, BsFillPlusCircleFill } from 'react-icons/bs';
import { IoLogOut } from 'react-icons/io5';
import './Header.css';




function Header() {

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            } else {
                console.error("No user found");
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <Navbar collapseOnSelect bg="light" variant="light">
            <div className="container">
                <Navbar.Brand>
                    <NavLink className="navbar-brand" to="/">All for you...</NavLink>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    {user ? (
                        <Nav>
                            <NavLink className="nav-item" id="addButton" to="/add-product">
                                <OverlayTrigger key="bottom" placement="bottom"
                                    overlay={<Tooltip id={`tooltip-bottom`}><strong>Add</strong> a sell.</Tooltip>}>
                                    <BsFillPlusCircleFill />
                                </OverlayTrigger>
                            </NavLink>
                            <NavDropdown title={<img id="navImg" src={placeholder} alt="user-avatar"/>} id="collasible-nav-dropdown">
                                <NavLink className="dropdown-item" to={`/profile/`}>
                                    <BsFillPersonFill />Profile
                                </NavLink>
                                <NavLink className="dropdown-item" to="/messages">
                                    <BsFillEnvelopeFill />Messages
                                </NavLink>
                                <NavDropdown.Divider />
                                <NavLink className="dropdown-item" to="/auth/logout" onClick={handleLogout}>
                                    <IoLogOut />Log out
                                </NavLink>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav>
                            <NavLink className="nav-item" to="/auth/login">Sign In</NavLink>
                            <NavLink className="nav-item" to="/auth/register">Sign Up</NavLink>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default Header;
