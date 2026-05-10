import React from 'react';
import { authService } from "../../services/authService";

const LogoutButton = () => {
    const handleLogout = () => {
        const isConfirmed = window.confirm("Are you sure you want to log out?");
        if (isConfirmed) {
            authService.logout();
            window.location.href = '/login';
        }
    };

    return (
        <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition shadow-sm"
        >
            Logout
        </button>
    );
};


export default LogoutButton;