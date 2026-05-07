import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';

const ProfilePage = () => {
    const { user, loading, error, update, setUser } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const result = await update(user);
        if (result.success) {
            setIsEditing(false);
            alert("Profile ကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ");
        } else {
            alert(result.error);
        }
        setIsSaving(false);
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
                
                <div className="px-8 pb-8">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-6">
                        <img 
                            src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.username} 
                            alt="Avatar" 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
                        />
                    </div>

                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">{isEditing ? "Edit Profile" : user.username}</h2>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input 
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={user.username}
                                    onChange={(e) => setUser({...user, username: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows="3"
                                    value={user.bio}
                                    onChange={(e) => setUser({...user, bio: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                                <input 
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={user.avatar}
                                    placeholder="https://example.com/photo.jpg"
                                    onChange={(e) => setUser({...user, avatar: e.target.value})}
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button 
                                    disabled={isSaving}
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">About Me</h4>
                                <p className="mt-2 text-gray-700 leading-relaxed">
                                    {user.bio || "ဒီလူက အကြောင်းအရာ ဘာမှမရေးထားသေးပါဘူး။"}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex space-x-10">
                                <div>
                                    <span className="block text-xl font-bold text-gray-800">0</span>
                                    <span className="text-sm text-gray-500">Posts</span>
                                </div>
                                <div>
                                    <span className="block text-xl font-bold text-gray-800">0</span>
                                    <span className="text-sm text-gray-500">Followers</span>
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