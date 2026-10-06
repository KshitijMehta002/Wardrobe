import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Register = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect');
    const initialVerify = searchParams.get('verify') === 'true';
    const initialEmail = searchParams.get('email') || '';

    const [name, setName] = useState('');
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(initialVerify && initialEmail ? 'otp' : 'register');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [infoMsg, setInfoMsg] = useState(initialVerify ? 'Please enter the verification code sent to your email.' : '');
    const [resendCooldown, setResendCooldown] = useState(0);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Countdown timer for Resend OTP button
    useEffect(() => {
        let timer;
        if (step === 'otp' && resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [step, resendCooldown]);

    // Handle initial registration (sends OTP to email)
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setInfoMsg('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (res.ok) {
                setStep('otp');
                setResendCooldown(60);
                setInfoMsg(data.message || 'OTP has been sent to your email.');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Something went wrong. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP verification and automatic login
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setInfoMsg('');

        if (!otp.trim() || otp.trim().length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otp.trim() })
            });
            const data = await res.json();

            if (res.ok) {
                // Automatically log the user in
                login(data);
                navigate(redirect ? (redirect.startsWith('/') ? redirect : `/${redirect}`) : '/');
            } else {
                setError(data.message || 'Invalid or expired OTP.');
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            setError('Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0 || loading) return;
        setError('');
        setInfoMsg('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                setResendCooldown(60);
                setInfoMsg(data.message || 'New OTP sent to your email.');
            } else {
                setError(data.message || 'Failed to resend OTP.');
            }
        } catch (err) {
            console.error('Resend OTP error:', err);
            setError('Failed to resend code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-container'>
            {step === 'register' ? (
                <form onSubmit={handleRegisterSubmit} className='auth-form'>
                    <h2>Register</h2>

                    {error && <div className='auth-error'>{error}</div>}

                    <input
                        type="text"
                        placeholder='Full Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        type="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <button type="submit" className='btn' disabled={loading}>
                        {loading ? 'Sending OTP...' : 'Register'}
                    </button>

                    <p>
                        Already have an account?{' '}
                        <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                            Login
                        </Link>
                    </p>
                </form>
            ) : (
                <form onSubmit={handleOtpSubmit} className='auth-form'>
                    <div className='otp-header-icon'>
                        <FaShieldAlt />
                    </div>
                    <h2>Verify OTP</h2>
                    <p className='otp-subtitle'>
                        We sent a 6-digit code to <strong>{email}</strong>
                    </p>

                    {error && <div className='auth-error'>{error}</div>}
                    {infoMsg && !error && (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.12)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            color: '#86efac',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: '0.88rem',
                            textAlign: 'center'
                        }}>
                            {infoMsg}
                        </div>
                    )}

                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="••••••"
                        className='otp-input'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                        required
                        disabled={loading}
                    />

                    <button type="submit" className='btn' disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Complete Registration'}
                    </button>

                    <div className='otp-resend-row'>
                        <span style={{ color: 'var(--text-secondary, #a1a1aa)' }}>
                            Didn't receive code?
                        </span>
                        <button
                            type="button"
                            className='btn-resend'
                            onClick={handleResendOtp}
                            disabled={resendCooldown > 0 || loading}
                        >
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                        </button>
                    </div>

                    <button
                        type="button"
                        className='btn-back-link'
                        onClick={() => {
                            setStep('register');
                            setOtp('');
                            setError('');
                            setInfoMsg('');
                        }}
                    >
                        <FaArrowLeft style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        Change email or details
                    </button>
                </form>
            )}
        </div>
    );
};

export default Register;