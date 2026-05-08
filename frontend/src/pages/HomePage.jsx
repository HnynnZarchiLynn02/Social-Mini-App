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
        /* ၁။ Container Width ကို max-w-5xl (ပိုကျယ်သော width) သို့ ပြောင်းလဲထားသည် */
        <div className="max-w-5xl mx-auto py-10 px-4">
            
            {/* Header Area with Search Box Design Change */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">News Feed</h1>
                    <p className="text-gray-500">Discover what's happening now</p>
                </div>

                {/* ၂။ Search Box Design အသစ် (Icon ပါဝင်ပြီး ပိုမိုရှင်းလင်းသော design) */}
                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm shadow-sm"
                        placeholder="Search posts or creators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Create Post (Takes 5 columns on large screens) */}
                <div className="lg:col-span-5">
                    <form onSubmit={handleCreatePost} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Create Post</h2>
                        {error && (
                            <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                                {error}
                            </div>
                        )}
                        <textarea
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 border border-transparent focus:border-blue-100 transition-all resize-none min-h-[120px]"
                            placeholder="Share your thoughts..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="mt-4 space-y-4">
                            <div className="relative group">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => setMedia(e.target.files?.[0] || null)}
                                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                />
                                {media && <p className="mt-2 text-[10px] text-blue-500 font-medium italic">Selected: {media.name}</p>}
                            </div>

                            <button
                                disabled={isPosting || (!content.trim() && !media)}
                                className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 disabled:bg-gray-200 disabled:shadow-none transition-all"
                            >
                                {isPosting ? 'Publishing...' : 'Post Now'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Feed (Takes 7 columns on large screens) */}
                <div className="lg:col-span-7">
                    {filteredPosts.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-gray-500 font-medium">No matches found for your search.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredPosts.map((post) => (
                                <PostCard
                                    key={getID(post)}
                                    post={post}
                                    currentUserID={currentUserID}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                    onToggleLike={handleToggleLike}
                                    onCreateComment={handleCreateComment}
                                    onUpdateComment={async (id, content) => { await api.put(`/comments/${id}`, { content }); fetchPosts(); }}
                                    onDeleteComment={async (id) => { if(window.confirm('Delete?')) { await api.delete(`/comments/${id}`); fetchPosts(); } }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;