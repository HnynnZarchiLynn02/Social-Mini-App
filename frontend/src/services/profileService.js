import api from '../api/axios';

export const profileService = {
    
    getProfile: async () => {
        const { data } = await api.get('/profile');
        return data;
    },
    
    updateProfile: async (profileData) => {
        const { data } = await api.put('/profile', profileData);
        return data;
    }
};