import api from '../api/axios';

export const profileService = {
    // Profile အချက်အလက်ယူရန်
    getProfile: async () => {
        const { data } = await api.get('/profile');
        return data;
    },
    // Profile ပြင်ဆင်ရန်
    updateProfile: async (profileData) => {
        const { data } = await api.put('/profile', profileData);
        return data;
    }
};