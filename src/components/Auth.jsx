import React, { useState } from 'react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [status, setStatus] = useState({ message: '', type: '' });
    const [user, setUser] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (status.message) setStatus({ message: '', type: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/register';
        const body = isLogin
            ? { email: formData.email, password: formData.password }
            : { name: formData.name, email: formData.email, password: formData.password };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                } else {
                    setStatus({ message: 'Account created! Please sign in.', type: 'success' });
                    setIsLogin(true);
                    setFormData({ ...formData, password: '' });
                }
            } else {
                setStatus({ message: data.message || 'Something went wrong', type: 'error' });
            }
        } catch (error) {
            setStatus({ message: 'Server connection failed', type: 'error' });
        }
    };

    if (user) {
        return (
            <div className="auth-container user-profile">
                <h2>{user.name}</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>{user.email}</p>
                <button className="secondary" onClick={() => {
                    setUser(null);
                    localStorage.removeItem('token');
                    setFormData({ name: '', email: '', password: '' });
                }}>Sign Out</button>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">{isLogin ? 'Sign In' : 'Register'}</button>
            </form>

            <div className="auth-footer">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <span className="toggle-link" onClick={() => {
                    setIsLogin(!isLogin);
                    setStatus({ message: '', type: '' });
                }}>
                    {isLogin ? ' Register' : ' Sign In'}
                </span>
            </div>

            {status.message && (
                <div className={`message ${status.type}`}>
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default Auth;
