import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';

export const useProfile = () => {
    const [user, setUser] = useState({ username: '', bio: '', avatar: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await profileService.getProfile();
            setUser(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Profile ဖတ်မရပါ');
        } finally {
            setLoading(false);
        }
    };

    const update = async (formData) => {
        try {
            const updatedUser = await profileService.updateProfile(formData);
            setUser(updatedUser.user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Update လုပ်မရပါ' };
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return { user, loading, error, update, setUser };
};