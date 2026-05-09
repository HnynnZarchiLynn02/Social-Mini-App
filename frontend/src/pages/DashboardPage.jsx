import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import PostCard from '../components/PostCard';

const DashboardPage = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const currentUserID = currentUser?.id || currentUser?.ID;

    // FIND THE FRESH POST: This ensures likes/comments update in the modal
    const activePost = myPosts.find(p => (p.id || p.ID) === selectedPostId);

    const fetchMyPosts = useCallback(async () => {
        try {
            const res = await axios.get('/my-posts');
            setMyPosts(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyPosts();
    }, [fetchMyPosts]);

    // CENTRALIZED ACTION HANDLER: Refreshes data after any change
    const runAction = async (promise) => {
        try {
            await promise;
            await fetchMyPosts(); // Re-syncs the UI with the database
        } catch (err) {
            console.error("Action failed", err);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Loading Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Modern Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Your Activity</h1>
                    <p className="text-slate-500 mt-3 text-lg">Manage your posts and engage with your audience.</p>
                </header>

                {/* Single Row Layout */}
                <div className="space-y-6">
                    {myPosts.length > 0 ? (
                        myPosts.map(post => (
                            <div 
                                key={post.ID || post.id} 
                                onClick={() => setSelectedPostId(post.ID || post.id)}
                                className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-6"
                            >
                                {/* User Badge */}
                                <div className="flex-shrink-0">
                                    <img 
                                        src={post.user?.avatar || `https://ui-avatars.com/api/?name=${post.user?.username}&background=eff6ff&color=2563eb`} 
                                        className="w-16 h-16 rounded-2xl object-cover shadow-inner"
                                        alt="avatar"
                                    />
                                </div>

                                {/* Content Preview */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-slate-900 text-lg">{post.user?.username}</span>
                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-100">You</span>
                                    </div>
                                    <p className="text-slate-600 line-clamp-2 leading-relaxed italic">
                                        "{post.content}"
                                    </p>
                                </div>

                                {/* Status Metrics */}
                                <div className="flex items-center gap-8 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                    <div className="text-center">
                                        <div className="text-xl font-black text-slate-800">{post.like_count || 0}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Likes</div>
                                    </div>
                                    <div className="text-center border-l border-slate-200 pl-8">
                                        <div className="text-xl font-black text-slate-800">{post.comments?.length || 0}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Comments</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                            No posts found. Go ahead and create one!
                        </div>
                    )}
                </div>
            </div>

            {/* Post Detail Modal */}
            {activePost && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                        onClick={() => setSelectedPostId(null)}
                    />
                    
                    <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Close Button */}
                        <button 
                            onClick={() => setSelectedPostId(null)}
                            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-colors z-50 text-xl font-bold"
                        >
                            ✕
                        </button>
                        
                        <div className="max-h-[85vh] overflow-y-auto p-4 scrollbar-hide">
                            <PostCard 
                                post={activePost} // This is now ALWAYS the updated version from state
                                currentUserID={currentUserID}
                                onUpdate={(id, content) => runAction(axios.put(`/posts/${id}`, { content }))}
                                onDelete={(id) => {
                                    if(window.confirm("Delete permanently?")) {
                                        runAction(axios.delete(`/posts/${id}`));
                                        setSelectedPostId(null);
                                    }
                                }}
                                onToggleLike={(id) => runAction(axios.post(`/posts/${id}/like`))}
                                onCreateComment={(id, content) => runAction(axios.post(`/posts/${id}/comments`, { content }))}
                                onUpdateComment={(id, content) => runAction(axios.put(`/comments/${id}`, { content }))}
                                onDeleteComment={(id) => runAction(axios.delete(`/comments/${id}`))}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;