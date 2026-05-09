import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';

const getID = (item) => item?.ID || item?.id;

const getUserIDFromToken = (token) => {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(payload)).user_id;
    } catch {
        return undefined;
    }
};

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const currentUserID = user?.id || user?.ID || getUserIDFromToken(user?.token || '');

    const filteredPosts = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return posts;

        return posts.filter((post) => {
            const username = post.user?.username || post.User?.username || '';
            const postContent = post.content || '';
            return `${username} ${postContent}`.toLowerCase().includes(query);
        });
    }, [posts, searchTerm]);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/posts');
            setPosts(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load posts');
        }
    };

    // ... handle functions (handleCreatePost, handleUpdate, etc. stay the same as your code)
    const handleCreatePost = async (e) => {
        e.preventDefault();
        const trimmedContent = content.trim();
        if (!trimmedContent && !media) return;
        try {
            setError('');
            setIsPosting(true);
            if (media) {
                const formData = new FormData();
                formData.append('content', trimmedContent);
                formData.append('media', media);
                await api.post('/posts', formData);
            } else {
                await api.post('/posts', { content: trimmedContent });
            }
            setContent('');
            setMedia(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchPosts();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        } finally {
            setIsPosting(false);
        }
    };

    const handleUpdate = async (id, nextContent) => {
        try {
            await api.put(`/posts/${id}`, { content: nextContent.trim() });
            fetchPosts();
        } catch (err) { throw err; }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this post?')) {
            try { await api.delete(`/posts/${id}`); fetchPosts(); }
            catch (err) { setError('Failed to delete'); }
        }
    };

    const handleToggleLike = async (postId) => {
        try {
            const { data } = await api.post(`/posts/${postId}/like`);
            setPosts((currentPosts) =>
                currentPosts.map((post) => {
                    if (Number(getID(post)) !== Number(postId)) return post;
                    return { ...post, is_liked: data.is_liked, like_count: data.like_count };
                })
            );
        } catch (err) { throw err; }
    };

    const handleCreateComment = async (postId, commentContent) => {
        try {
            const response = await api.post(`/posts/${postId}/comments`, { content: commentContent.trim() });
            fetchPosts();
            return response.data;
        } catch (err) { throw err; }
    };

    useEffect(() => { fetchPosts(); }, []);

    return (
        /* Container ကို max-w-6xl အထိ ချဲ့လိုက်ခြင်းဖြင့် နေရာပိုရစေပါတယ် */
        <div className="max-w-6xl mx-auto py-10 px-4">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">News Feed</h1>
                    <p className="text-gray-500">Discover what's happening now</p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="Search posts or creators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* --- Left Side: Create Post (40% width approx) --- */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24">
                        <form onSubmit={handleCreatePost} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Create Post</h2>
                            
                            {error && (
                                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <textarea
                                className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 border border-transparent focus:border-blue-100 transition-all resize-none min-h-[160px] text-gray-700 leading-relaxed"
                                placeholder="What's on your mind? Share it with the community..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            <div className="mt-6 space-y-5">
                                <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl hover:border-blue-100 transition-colors bg-gray-50/50">
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Add Media</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={(e) => setMedia(e.target.files?.[0] || null)}
                                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                    />
                                    {media && (
                                        <div className="mt-3 flex items-center gap-2 text-blue-600 animate-pulse">
                                            <span className="text-xs font-bold">📎 Selected: {media.name}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    disabled={isPosting || (!content.trim() && !media)}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-200 disabled:shadow-none transition-all"
                                >
                                    {isPosting ? 'Publishing...' : 'Post Now'}
                                </button>
                            </div>
                        </form>
                        
                        {/* အောက်မှာ Space လေးပိုအောင် (Optional) */}
                        <p className="mt-6 text-center text-gray-400 text-xs">Community Guidelines apply.</p>
                    </div>
                </div>

                {/* --- Right Side: Feed (50-60% width approx) --- */}
                <div className="lg:col-span-7">
                    {filteredPosts.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
                            <div className="text-6xl mb-4">🔎</div>
                            <h3 className="text-xl font-bold text-gray-800">No results found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search keywords.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {filteredPosts.map((post) => (
                                <div key={getID(post)} className="transform transition-all hover:translate-x-1">
                                    <PostCard
                                        post={post}
                                        currentUserID={currentUserID}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onToggleLike={handleToggleLike}
                                        onCreateComment={handleCreateComment}
                                        onUpdateComment={async (id, content) => { await api.put(`/comments/${id}`, { content }); fetchPosts(); }}
                                        onDeleteComment={async (id) => { if(window.confirm('Delete?')) { await api.delete(`/comments/${id}`); fetchPosts(); } }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default HomePage;