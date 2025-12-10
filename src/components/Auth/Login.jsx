import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ICON_STYLE = { 
    background: '#242424', 
    border: '1px solid #444', 
    color: '#fff',
    borderRight: 'none', // Para mag-blend sa input
};
const INPUT_STYLE = { background: '#242424', color: '#fff' };

const Login = ({ isForgotPassword = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            if (isForgotPassword) {
                await resetPassword(email);
                setMessage('Password reset link sent to your email!');
            } else {
                await login(email, password);
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', '')); 
        }
        setLoading(false);
    };

    return (
        <div className="d-flex align-items-center min-vh-100" style={{ background: '#0a0a0a' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="login-container shadow-lg p-5" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                            <div className="text-center mb-4">
                                <img src="/logo.png" alt="EcoVolt" className="login-logo" style={{ width: '120px' }}/>
                                <h5 className="text-white">{isForgotPassword ? 'Forgot Password' : 'Welcome Back'}</h5>
                                <p className="small text-white">{isForgotPassword ? 'Enter your email to receive a reset link' : 'Sign in to access the Dashboard'}</p>
                            </div>

                            {error && <div className="alert alert-danger p-2 small">{error}</div>}
                            {message && <div className="alert alert-success p-2 small">{message}</div>}

                            <form onSubmit={handleSubmit}>
                                {/* --- Email Input with Icon --- */}
                                <div className="mb-3 input-group">
                                    <span className="input-group-text" style={ICON_STYLE}><i className="fas fa-envelope"></i></span>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="Email Address" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                        style={{ ...INPUT_STYLE, borderLeft: 'none' }} // Remove left border to match icon
                                    />
                                </div>
                                {/* --- Password Input with Icon and Toggle --- */}
                                {!isForgotPassword && (
                                    <div className="mb-4 input-group">
                                        <span className="input-group-text" style={ICON_STYLE}><i className="fas fa-lock"></i></span>
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            className="form-control" 
                                            placeholder="Password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required 
                                            style={{ ...INPUT_STYLE, borderLeft: 'none' }} // Remove left border to match icon
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ background: '#242424', border: '1px solid #444', color: '#fff' }}
                                        >
                                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                )}
                                
                                <button type="submit" disabled={loading} className="btn btn-success-custom btn-lg w-100">
                                    <i className={`fas ${loading ? 'fa-spinner fa-spin' : (isForgotPassword ? 'fa-paper-plane' : 'fa-sign-in-alt')} me-2`}></i> 
                                    {loading ? 'Loading...' : (isForgotPassword ? 'Send Reset Link' : 'Login')}
                                </button>
                            </form>
                            
                            <div className="text-center mt-4">
                                {isForgotPassword ? (
                                    <Link to="/login" className="small text-white">Back to Login</Link>
                                ) : (
                                    <>
                                        <Link to="/register" className="small text-white d-block mb-2">No Account? Register Now</Link>
                                        <Link to="/forgot-password" className="small text-white">Forgot Password?</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;