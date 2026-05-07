// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useProfile = () => {
    const [user, setUser] = useState({ username: '', bio: '', avatar: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Refresh လုပ်တိုင်း Server ဆီက data အသစ်ကို ဆွဲယူခြင်း
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/profile');
                setUser(data);
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const update = async (updatedData) => {
        try {
            const { data } = await api.put('/profile', updatedData);
            setUser(data.user || data); // Update လုပ်ပြီးရင် state ကို ချက်ချင်းလဲပေးခြင်း
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || "Update error" };
        }
    };

    return { user, loading, error, update, setUser };
};