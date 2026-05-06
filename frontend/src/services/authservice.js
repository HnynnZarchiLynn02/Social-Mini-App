import api from '../api/axios';

export const authService = {
    async register(username, email, password) {
        return await api.post('/register', { username, email, password });
    },
    async login(email, password) {
        const { data } = await api.post('/login', { email, password });
        if (data.token) {
            localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    },
    logout() {
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};