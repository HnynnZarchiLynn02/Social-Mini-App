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
        
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 font-sans">
            <div className="w-full max-w-md">
                {/* App Heading */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                       Register
                    </h1>
                   
                </div>

                
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
                        <p className="text-sm text-slate-400 mt-1">Join our community in a few steps.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Username</label>
                            <input 
                                type="text" 
                                placeholder="e.g. alex_stone" 
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-4 focus:ring-slate-400/10 focus:border-slate-400 outline-none transition-all text-slate-700 placeholder:text-slate-300" 
                                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                required 
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-4 focus:ring-slate-400/10 focus:border-slate-400 outline-none transition-all text-slate-700 placeholder:text-slate-300" 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>

                        
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-4 focus:ring-slate-400/10 focus:border-slate-400 outline-none transition-all text-slate-700" 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                required 
                                minLength={6}
                            />
                        </div>

                        <div className="pt-2">
                            <button className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all active:scale-[0.98] shadow-md">
                                Create Account
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Already have an account? <Link to="/login" className="text-slate-900 font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-50">Social App &bull; Secure Registration</span>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;