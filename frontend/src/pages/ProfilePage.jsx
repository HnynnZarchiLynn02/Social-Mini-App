import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import api from '../api/axios';

const ProfilePage = () => {
    const { user, loading, error, update, setUser } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSave = async () => {
        setIsSaving(true);
        let currentAvatar = user.avatar;

        try {
            // ၁။ ပုံအသစ်ရှိလျှင် အရင်တင်မည်
            if (selectedFile) {
                const formData = new FormData();
                formData.append('avatar', selectedFile);

                const res = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                currentAvatar = res.data.url;
            }

            // ၂။ Profile အချက်အလက်များ Update လုပ်မည်
            const updatedData = { ...user, avatar: currentAvatar };
            const result = await update(updatedData);

            if (result.success) {
                // *** အရေးကြီးဆုံးအပိုင်း- LocalStorage ကိုပါ Update လုပ်မည် ***
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    const newUser = { ...storedUser, username: user.username };
                    localStorage.setItem('user', JSON.stringify(newUser));
                }

                setIsEditing(false);
                setSelectedFile(null);
                alert("Profile ကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ");
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error("Update Error:", err);
            alert("ပြင်ဆင်ရာတွင် အမှားရှိနေပါသည်");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="text-center mt-20 font-medium">Loading profile...</div>;
    if (error) return <div className="text-center mt-20 text-red-500 font-medium">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
                
                <div className="px-8 pb-8">
                    {/* Avatar Display & Picker */}
                    <div className="relative -mt-16 mb-6 inline-block">
                        <img 
                            src={selectedFile ? URL.createObjectURL(selectedFile) : (user.avatar || 'https://ui-avatars.com/api/?name=' + user.username)} 
                            alt="Avatar" 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
                        />
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-sm border-2 border-white transition-all">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                            </label>
                        )}
                    </div>

                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">{isEditing ? "Edit Profile" : user.username}</h2>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
                                <input 
                                    type="text"
                                    className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={user.username}
                                    onChange={(e) => setUser({...user, username: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Bio</label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    rows="3"
                                    value={user.bio}
                                    onChange={(e) => setUser({...user, bio: e.target.value})}
                                    placeholder="Tell us something about yourself..."
                                />
                            </div>
                            
                            <div className="flex space-x-3 pt-4">
                                <button 
                                    disabled={isSaving}
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-md"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                                <button 
                                    onClick={() => { setIsEditing(false); setSelectedFile(null); }}
                                    className="bg-gray-100 text-gray-600 px-8 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">About Me</h4>
                                <p className="mt-2 text-gray-700 leading-relaxed text-lg">
                                    {user.bio || "No bio added yet."}
                                </p>
                            </div>
                            <div className="pt-6 border-t border-gray-100 flex space-x-12">
                                <div>
                                    <span className="block text-2xl font-black text-gray-800">0</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase">Posts</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-gray-800">0</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase">Followers</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;