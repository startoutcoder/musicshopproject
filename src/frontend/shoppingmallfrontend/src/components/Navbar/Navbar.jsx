
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import './Navbar.css';

import logoImage from '../../assets/images/166d9996a81fa7929494275d91017d45.jpg';
import ThemeToggleButton from "../ThemeToggle/ThemeToggleButton.jsx";

function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { totalQuantity } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleLogout = () => {
        dispatch(logout());
        setDropdownOpen(false);
        navigate('/');
    };

    const profilePicStyle = {
        backgroundImage: `url(${user?.profilePicture})`
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={logoImage} alt="ShoppingMallLogo" className="logo-image"/>
                </Link>

                <div className="nav-right-section">
                    <ul className="nav-menu">
                        <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
                        <li className="nav-item"><Link to="/products" className="nav-link">Products</Link></li>
                        <li className="nav-item">
                            <Link to="/cart" className="nav-link cart-link">
                                Cart
                                {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
                            </Link>
                        </li>
                    </ul>

                    <div className="nav-user-area">
                        {isAuthenticated ? (
                            <div className="nav-user-profile" ref={dropdownRef}>
                                <div
                                    className="nav-profile-pic"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    style={user?.profilePicture ? profilePicStyle : {}}
                                >
                                    {!user?.profilePicture && user?.userName ? user.userName.charAt(0).toUpperCase() : ''}
                                </div>

                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">Signed in as <strong>{user.userName}</strong></div>
                                        <Link to={`/profile/${user.userId}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                                        <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                                        <Link to={`/profile/${user.userId}/settingspage`} className = "dropdown-item" onClick={() => setDropdownOpen(false)}>Settings</Link>
                                        <div className = "dropdown-item" ><ThemeToggleButton/></div>
                                        <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="nav-link-button">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;