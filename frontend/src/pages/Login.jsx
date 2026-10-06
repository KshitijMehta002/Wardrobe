import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = new URLSearchParams(location.search).get('redirect');

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({ email, password})
            });
            const data = await res.json();
            if(res.ok){
              login(data);
              navigate(redirect ? (redirect.startsWith('/') ? redirect : `/${redirect}`) : '/'); 
            } else if (res.status === 403 && data.requiresVerification) {
              alert(data.message || 'Please verify your email before logging in.');
              navigate(`/register?verify=true&email=${encodeURIComponent(data.email || email)}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`);
            } else {
              alert(data.message)
            }
        }catch (error){
          console.error(error);
        }
    };
    return (
            <div className='auth-container'>
              <form onSubmit={handleSubmit} className='auth-form'>
                <h2>Login</h2>
                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className='btn'>Login</button>
                <p>Don't have an account? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>register</Link></p>
              </form>
            </div>
    );
};

export default Login;