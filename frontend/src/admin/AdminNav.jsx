import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaChartPie, 
  FaBoxes, 
  FaPlusCircle, 
  FaShoppingBag, 
  FaUsers, 
  FaStore,
  FaShieldAlt
} from 'react-icons/fa';

const AdminNav = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="admin-nav-wrapper">
      <div className="admin-nav-container">
        <div className="admin-nav-tabs">
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaChartPie /> Dashboard
          </NavLink>

          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaBoxes /> Products
          </NavLink>

          <NavLink 
            to="/admin/add-product" 
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaPlusCircle /> Add Product
          </NavLink>

          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaShoppingBag /> Orders
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaUsers /> Users
          </NavLink>
        </div>

        <div className="admin-nav-right">
          <div className="admin-badge-pill">
            <FaShieldAlt style={{ marginRight: '4px' }} /> Admin Portal
          </div>
          <Link to="/shop" className="admin-btn admin-btn-secondary admin-btn-sm">
            <FaStore /> View Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
