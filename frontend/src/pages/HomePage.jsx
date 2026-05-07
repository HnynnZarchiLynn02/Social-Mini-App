import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchPosts = async () => {
        const { data } = await api.get('/posts');
        setPosts(data);
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        await api.post('/posts', { content });
        setContent('');
        fetchPosts();
    };

    const handleDelete = async (id) => {
        if (window.confirm("ဖျက်မှာ သေချာပါသလား?")) {
            await api.delete(`/posts/${id}`);
            fetchPosts();
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            {/* Create Post Area */}
            <form onSubmit={handleCreatePost} className="bg-white p-4 rounded-xl shadow-sm border mb-6">
                <textarea 
                    className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="ဘာတွေတွေးနေလဲ..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                    Post
                </button>
            </form>

            {/* Feed */}
            {posts.map(post => (
                <PostCard 
                    key={post.ID} 
                    post={post} 
                    currentUserID={user?.id} 
                    onDelete={handleDelete} 
                />
            ))}
        </div>
    );
};

export default HomePage;