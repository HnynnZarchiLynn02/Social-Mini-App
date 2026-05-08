import React, { useState, useEffect } from 'react'; // useEffect ထည့်သွင်းပါ
import { useProfile } from '../hooks/useProfile';
import api from '../api/axios';

const ProfilePage = () => {
    const { user, loading, error, update, setUser } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    
    
    const [stats, setStats] = useState({ postCount: 0, totalLikes: 0 });

    
    const fetchUserStats = async () => {
        try {
            
            const res = await api.get('/my-posts'); 
            const posts = res.data || [];
            
       
            const likes = posts.reduce((sum, post) => sum + (post.like_count || 0), 0);
            
            setStats({
                postCount: posts.length,
                totalLikes: likes
            });
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserStats();
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        let currentAvatar = user.avatar;
        try {
            if (selectedFile) {
                const formData = new FormData();
                formData.append('avatar', selectedFile);
                const res = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                currentAvatar = res.data.url;
            }

            const updatedData = { ...user, avatar: currentAvatar };
            const result = await update(updatedData);

            if (result.success) {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    const newUser = { ...storedUser, username: user.username, avatar: currentAvatar };
                    localStorage.setItem('user', JSON.stringify(newUser));
                }
                setIsEditing(false);
                setSelectedFile(null);
                alert("Profile အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ");
            }
        } catch (err) {
            alert("ပြင်ဆင်ရာတွင် အမှားရှိနေပါသည်");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="text-center mt-20 font-medium italic text-gray-400">Loading profile...</div>;
    if (error) return <div className="text-center mt-20 text-red-500 font-medium">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
                
                <div className="px-8 pb-8">
                    {/* Avatar Display & Picker */}
                    <div className="relative -mt-16 mb-6 inline-block">
                        <img 
                            src={selectedFile ? URL.createObjectURL(selectedFile) : (user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`)} 
                            alt="Avatar" 
                            className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl bg-white object-cover"
                        />
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-2xl cursor-pointer hover:bg-blue-700 shadow-lg border-2 border-white transition-all transform hover:scale-110">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                            </label>
                        )}
                    </div>

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight">{isEditing ? "Edit Profile" : user.username}</h2>
                           
                        </div>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-md">
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Username</label>
                                <input 
                                    type="text"
                                    className="w-full border border-gray-200 bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all"
                                    value={user.username}
                                    onChange={(e) => setUser({...user, username: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Bio</label>
                                <textarea 
                                    className="w-full border border-gray-200 bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all"
                                    rows="4"
                                    value={user.bio}
                                    onChange={(e) => setUser({...user, bio: e.target.value})}
                                    placeholder="Tell the world your story..."
                                />
                            </div>
                            
                            <div className="flex space-x-4 pt-4">
                                <button 
                                    disabled={isSaving}
                                    onClick={handleSave}
                                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-lg shadow-blue-200"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                                <button 
                                    onClick={() => { setIsEditing(false); setSelectedFile(null); }}
                                    className="px-8 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">About Me</h4>
                                <p className="text-gray-600 leading-relaxed text-lg font-medium">
                                    {user.bio || "This user prefers to keep their bio a mystery. 🕵️‍♂️"}
                                </p>
                            </div>

                            <div className="pt-8 border-t border-gray-100 flex gap-16">
                                <div className="group">
                                    <span className="block text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {stats.postCount}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Posts</span>
                                </div>
                                <div className="group">
                                    <span className="block text-3xl font-black text-gray-900 group-hover:text-pink-500 transition-colors">
                                        {stats.totalLikes}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Likes</span>
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