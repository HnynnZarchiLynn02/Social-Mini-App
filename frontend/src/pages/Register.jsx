import React, { useState } from 'react';
import { registerUser } from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            alert("Registration Successful!"); //
            console.log(response.data);
        } catch (error) {
            alert(error.response?.data?.error || "Registration Failed");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Register Account</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        name="username" 
                        placeholder="Username" 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px' }}
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="Email" 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px' }}
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Password (min 6)" 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px' }}
                        required 
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Register;