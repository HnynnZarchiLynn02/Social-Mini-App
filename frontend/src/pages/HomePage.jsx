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
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchPosts();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        } finally {
            setIsPosting(false);
        }
    };

    const handleUpdate = async (id, nextContent) => {
        const trimmedContent = nextContent.trim();
        if (!trimmedContent) return;

        try {
            setError('');
            await api.put(`/posts/${id}`, { content: trimmedContent });
            fetchPosts();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update post');
            throw err;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this post?')) {
            try {
                setError('');
                await api.delete(`/posts/${id}`);
                fetchPosts();
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to delete post');
            }
        }
    };

    const handleToggleLike = async (postId) => {
        try {
            setError('');
            const { data } = await api.post(`/posts/${postId}/like`);

            setPosts((currentPosts) =>
                currentPosts.map((post) => {
                    if (Number(getID(post)) !== Number(postId)) return post;
                    return {
                        ...post,
                        is_liked: data.is_liked,
                        like_count: data.like_count,
                    };
                })
            );
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update like');
            throw err;
        }
    };

    const handleCreateComment = async (postId, commentContent) => {
        const trimmedContent = commentContent.trim();
        if (!trimmedContent) return;

        try {
            setError('');
            const response = await api.post(`/posts/${postId}/comments`, { content: trimmedContent });
            const createdComment = response.data;
            setPosts((currentPosts) =>
                currentPosts.map((post) => {
                    if (Number(getID(post)) !== Number(postId)) return post;
                    const comments = post.comments || post.Comments || [];
                    return { ...post, comments: [...comments, createdComment] };
                })
            );
            await fetchPosts();
            return createdComment;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create comment');
            throw err;
        }
    };

    const handleUpdateComment = async (commentId, commentContent) => {
        const trimmedContent = commentContent.trim();
        if (!trimmedContent) return;

        try {
            setError('');
            await api.put(`/comments/${commentId}`, { content: trimmedContent });
            fetchPosts();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update comment');
            throw err;
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Delete this comment?')) {
            try {
                setError('');
                await api.delete(`/comments/${commentId}`);
                fetchPosts();
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to delete comment');
            }
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <form onSubmit={handleCreatePost} className="bg-white p-4 rounded-xl shadow-sm border mb-6">
                {error && (
                    <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}
                <textarea
                    className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="What are you thinking?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setMedia(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                        />
                        {media && (
                            <p className="mt-1 text-xs text-gray-500">
                                Selected: {media.name}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isPosting || (!content.trim() && !media)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isPosting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>

            <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
                <input
                    className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Search users or posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredPosts.length === 0 && (
                <div className="bg-white border rounded-xl p-6 text-center text-sm text-gray-500">
                    No posts found.
                </div>
            )}

            {filteredPosts.map((post) => (
                <PostCard
                    key={post.ID || post.id}
                    post={post}
                    currentUserID={currentUserID}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onToggleLike={handleToggleLike}
                    onCreateComment={handleCreateComment}
                    onUpdateComment={handleUpdateComment}
                    onDeleteComment={handleDeleteComment}
                />
            ))}
        </div>
    );
};

export default HomePage;
