import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await authService.login(email, password);
            alert(`Welcome ${user.username}`);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.error || "Login Failed");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Login</h2>
                <input type="email" placeholder="Email" className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                    onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="w-full border p-3 mb-6 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                    onChange={(e) => setPassword(e.target.value)} required />
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">Sign In</button>
                <p className="mt-4 text-center text-sm">Need an account? <Link to="/register" className="text-green-500">Register</Link></p>
            </form>
        </div>
    );
};

export default LoginPage;