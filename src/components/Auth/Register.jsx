import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { setDoc, doc } from 'firebase/firestore'; 
import { db } from '../../firebase'; 

const ICON_STYLE = { 
    background: '#242424', 
    border: '1px solid #444', 
    color: '#fff',
    borderRight: 'none', // Para mag-blend sa input
};
const INPUT_STYLE = { background: '#242424', color: '#fff' };

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState(''); 
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await register(email, password, displayName);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                displayName: displayName,
                email: user.email,
                role: 'Operator', 
                createdAt: new Date(),
            });

            alert('Registration Successful! Please login.');
            navigate('/login');
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
                                <h5 className="text-white">Create Account</h5>
                                <p className="small text-white">Sign up to access the EcoVolt Dashboard</p>
                            </div>
                            
                            {error && <div className="alert alert-danger p-2 small">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                {/* --- Full Name Input with Icon --- */}
                                <div className="mb-3 input-group">
                                    <span className="input-group-text" style={ICON_STYLE}><i className="fas fa-user"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Full Name" 
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        required 
                                        style={{ ...INPUT_STYLE, borderLeft: 'none' }}
                                    />
                                </div>
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
                                        style={{ ...INPUT_STYLE, borderLeft: 'none' }}
                                    />
                                </div>
                                {/* --- Password Input with Icon --- */}
                                <div className="mb-4 input-group">
                                    <span className="input-group-text" style={ICON_STYLE}><i className="fas fa-lock"></i></span>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Password (Min 6 characters)" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                        style={{ ...INPUT_STYLE, borderLeft: 'none' }}
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="btn btn-success-custom btn-lg w-100">
                                    <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-user-plus'} me-2`}></i> 
                                    {loading ? 'Processing...' : 'Register'}
                                </button>
                            </form>
                            
                            <div className="text-center mt-4">
                                <small className="text-white">
                                    Already have an account? 
                                    <Link to="/login" className="text-white text-decoration-none">Login Here</Link>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;