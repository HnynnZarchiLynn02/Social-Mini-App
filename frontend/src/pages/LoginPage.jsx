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
            await authService.login(email, password);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.error || "Login Failed");
        }
    };

    return (
        // Background ကို Slate-100 သုံးပြီး အနည်းငယ် ပိုမှောင်စေပါတယ် (မီးခိုးနုရောင်)
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 font-sans">
            <div className="w-full max-w-md">
                {/* App Heading */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                        Social App
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Your space for connection.</p>
                </div>

                {/* Login Card - Shadow ကို ပိုလေးအောင် ပြင်ထားပါတယ် */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
                        <p className="text-sm text-slate-400 mt-1">Good to see you again.</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-4 focus:ring-slate-400/10 focus:border-slate-400 outline-none transition-all text-slate-700 placeholder:text-slate-300" 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-4 focus:ring-slate-400/10 focus:border-slate-400 outline-none transition-all text-slate-700" 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="pt-2">
                            <button className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all active:scale-[0.98] shadow-md">
                                Sign In
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Need an account? <Link to="/register" className="text-slate-900 font-bold hover:underline">Register</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-12 text-center">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-50">Social App &bull; Secure Login</span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;