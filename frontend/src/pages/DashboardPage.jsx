import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import PostCard from '../components/PostCard';

const DashboardPage = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const currentUserID = currentUser?.id || currentUser?.ID;

    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/my-posts');
            setMyPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    if (loading) return <div className="text-center py-20 italic text-gray-400">Loading your posts...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Dashboard</h1>
                <p className="text-slate-500 mt-2">Manage and review your shared stories.</p>
            </div>

            <div className="flex flex-col gap-4">
                {myPosts.length > 0 ? (
                    myPosts.map(post => (
                        <div 
                            key={post.ID || post.id} 
                            onClick={() => setSelectedPost(post)}
                            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all flex items-center gap-6 group"
                        >
                            {/* Profile Picture Section */}
                            <div className="flex-shrink-0 relative">
                                <img 
                                    src={post.user?.avatar || `https://ui-avatars.com/api/?name=${post.user?.username}&background=random`} 
                                    alt="profile"
                                    className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-blue-50 transition-all"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            {/* Content Preview Section */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-800 capitalize">{post.user?.username}</h4>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-md">Author</span>
                                </div>
                                <h3 className="text-slate-600 truncate text-sm">
                                    {post.content}
                                </h3>
                            </div>

                            {/* Stats Summary */}
                            <div className="hidden sm:flex items-center gap-6 pr-4">
                                <div className="text-center">
                                    <p className="text-sm font-black text-slate-700">{post.like_count || 0}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Likes</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-slate-700">{post.comments?.length || 0}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Comments</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span className="text-xl">→</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-slate-400 italic">No posts found in your collection.</div>
                )}
            </div>

            {/* Post Detail Modal */}
            {selectedPost && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl relative scrollbar-hide">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedPost(null); }}
                            className="absolute top-6 right-6 bg-slate-100 hover:bg-red-50 hover:text-red-500 w-10 h-10 rounded-full flex items-center justify-center font-bold z-20 transition-colors"
                        >
                            ✕
                        </button>
                        
                        <div className="p-2">
                            <PostCard 
                                post={selectedPost}
                                currentUserID={currentUserID}
                                onUpdate={async (id, content) => { await axios.put(`/posts/${id}`, { content }); fetchMyPosts(); setSelectedPost(null); }}
                                onDelete={async (id) => { if(window.confirm("Permanent delete?")) { await axios.delete(`/posts/${id}`); fetchMyPosts(); setSelectedPost(null); } }}
                                onToggleLike={async (id) => { await axios.post(`/posts/${id}/like`); fetchMyPosts(); }}
                                onCreateComment={async (id, content) => { await axios.post(`/posts/${id}/comments`, { content }); fetchMyPosts(); }}
                                onUpdateComment={(id, content) => axios.put(`/comments/${id}`, { content }).then(fetchMyPosts)}
                                onDeleteComment={(id) => axios.delete(`/comments/${id}`).then(fetchMyPosts)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;