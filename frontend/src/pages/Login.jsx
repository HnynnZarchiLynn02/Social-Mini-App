import React,{useState} from 'react';
import { loginUser } from '../services/authservice';

const Login=()=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const handleLogin=async (e)=>{
        e.preventDefault();
        try{
            const {data}=await loginUser({email,password});

            localStorage.setItem('token',data.token);
            alert("Login Successful")

            window.location.href='/';

        }
        catch(error){
            alert(error.response?.data?.error||"Login Failed");
        }
    };
    return (
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email"
            onChange={(e)=>setEmail(e.target.valuse)} required/>
            <input type="password" placeholder="Password"
            onChange={(e)=>setPassword(e.target.valuse)} required/>
            <button type="submit">Login</button>

        </form>
    );
};
export default Login;