import axios from 'axios';

const API_URL="http://localhost:8080";

export const registerUser=async (registerUserData)=>
{
    return await axios.post(`${API_URL}/register`,userData);
};

export const loginUser=async(credentials)=>{
    return await axios.post(`{$API_URL}/login`,credentials)
};

