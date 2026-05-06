import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // သင်၏ Backend Port
});

// Request တိုင်းမှာ JWT Token ပါသွားအောင် Interceptor ထည့်ခြင်း
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;