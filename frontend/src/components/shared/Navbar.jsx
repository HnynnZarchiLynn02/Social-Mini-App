import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from "./LogoutButton";

const Navbar = () => {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const userData = userString ? JSON.parse(userString) : null;

    
    const user = userData?.user || userData;
    const BACKEND_URL = "http://localhost:8080";

    const getNavbarProfilePic = () => {
        if (!user) {
            return `https://ui-avatars.com/api/?name=Guest&background=0284c7&color=fff`;
        }

        let picPath = user?.avatar || user?.profile_pic || user?.media_url;

        if (picPath && picPath !== "null" && picPath !== "") {
            picPath = picPath.trim();
            if (picPath.startsWith('http')) return picPath;

           
            const cleanPath = picPath.replace(/^\/+/, '');
            return `${BACKEND_URL}/${cleanPath.startsWith('uploads/') ? cleanPath : 'uploads/' + cleanPath}`;
        }

        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=0284c7&color=fff&bold=true`;
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4">
                <div className="h-16 flex items-center justify-between">
                    
                    {/* Left: Logo & Nav Links */}
                    <div className="flex items-center gap-8">
                        <Link to="/home" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="hidden md:flex flex-col leading-none">
                                <span className="text-lg font-black tracking-tight text-slate-900">SOCIAL<span className="text-blue-600">APP</span></span>
                                <span className="text-[10px] uppercase tracking-[3px] text-slate-400 font-bold">Connect People</span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-10 font-bold text-gray-900">
                <Link to="/home" className="text-[17px] hover:text-blue-600 transition-all hover:scale-105">Feed</Link>
                <Link to="/profile" className="text-[17px] hover:text-blue-600 transition-all hover:scale-105">Profile</Link>
                <Link to="/dashboard" className="text-[17px] hover:text-blue-600 transition-all hover:scale-105">Dashboard</Link>
            </div>
                    </div>

                    {/* Right: User Profile & Logout */}
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-white border border-slate-200 px-2 py-1.5 rounded-full shadow-sm hover:shadow-md transition">
                                
                               
                                <div 
                                    className="relative cursor-pointer group"
                                    onClick={() => navigate('/profile')}
                                >
                                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:ring-2 group-hover:ring-blue-400 transition-all">
                                        <img
                                            src={getNavbarProfilePic()}
                                            alt="profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0284c7&color=fff`;
                                            }}
                                        />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                                </div>

                                {/* Username Info */}
                                <div 
                                    className="hidden sm:flex flex-col pr-2 cursor-pointer"
                                    onClick={() => navigate('/profile')}
                                >
                                    <span className="text-sm font-bold text-slate-800 leading-none hover:text-blue-600 transition">
                                        {user?.username || 'User'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 font-semibold">
                                        Online
                                    </span>
                                </div>
                            </div>
                        )}
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;