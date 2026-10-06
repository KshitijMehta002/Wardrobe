
import React, {useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../styles/navbar.css"
import logo from "../assets/logo.png"
import { useSelector} from 'react-redux';
import {AuthContext} from '../context/AuthContext.jsx';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart?.cartItems || []);
    const totalCartCount = cartItems.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  return (
    <>
      <div className="navbar-top-bar">
        <div className="top-bar-announcement">
          <span className="top-bar-star">★</span>
          <span>Free Shipping on Orders Above ₹999</span>
        </div>
        <div className="top-bar-links">
          <Link to="/profile">Track Order</Link>
          <span className="top-bar-sep">|</span>
          <Link to="/about">Help & Support</Link>
        </div>
      </div>
      <nav className='navbar'>
        <div className="navbar-brand">
            <Link to="/">
              <img src={logo} alt="logo" className='logo' />
              <span>Prachi Wardrobe</span>
            </Link>
        </div>
        <ul className="navbar-links">
            <li><Link to="/shop">Shop</Link></li>
            <li>
                <Link to="/cart" className="navbar-cart-link">
                    Cart
                    {totalCartCount > 0 && (
                        <span className="nav-cart-badge">
                            {totalCartCount}
                        </span>
                    )}
                </Link>
            </li>
            {user ?(
                <>
                <li><Link to="/profile">Hi, {user.name} </Link></li>
                {user.role == "admin" && <li><Link to='/admin'>Admin</Link></li> }
                <li><button onClick={handleLogout} className='btn-logout'>Logout</button></li>
                </>
            ): (
                <li><Link to="/login">Login</Link></li>
            )}
        </ul>
      </nav>
    </>
  )
}

export default Navbar