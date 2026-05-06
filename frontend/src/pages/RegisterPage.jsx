import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData.username, formData.email, formData.password);
            alert("Registration Successful!");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Registration Failed");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Register</h2>
                <input type="text" placeholder="Username" className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                <input type="email" placeholder="Email" className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password (min 6)" className="w-full border p-3 mb-6 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength={6} />
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Sign Up</button>
                <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
            </form>
        </div>
    );
};

export default RegisterPage;