import { useState } from "react";

export const useAuth=()=>{
    const [token,setToken]=useState(localStorage.getItem('token'));
    const logout=()=>{
        localStorage.removeItem('token');
        setToken(null);
        window.location.href='/login';
    };
    return {token,logout};
};