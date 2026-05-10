import React, { useEffect, useMemo, useState } from 'react';
import { postService } from '../services/postService';
import PostCard from "../components/feed/PostCard";
import PostForm from '../components/feed/PostForm';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const currentUserID = user?.id || user?.ID;

    const fetchPosts = async () => {
        try {
            const { data } = await postService.getAll();
            setPosts(data);
        } catch (err) { console.error("Fetch failed"); }
    };

    useEffect(() => { fetchPosts(); }, []);

    const filteredPosts = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return posts;
        return posts.filter(p => 
            `${p.user?.username} ${p.content}`.toLowerCase().includes(query)
        );
    }, [posts, searchTerm]);

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h1 className="text-3xl font-black text-gray-900">News Feed</h1>
                <input 
                    className="block w-full md:w-96 p-3 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5">
                    <div className="sticky top-24">
                        <PostForm onPostCreated={fetchPosts} />
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-8">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center p-20 border-2 border-dashed rounded-3xl text-gray-400">No posts found</div>
                    ) : (
                        filteredPosts.map(post => (
                            <PostCard 
                                key={post.id || post.ID} 
                                post={post} 
                                currentUserID={currentUserID}
                                onUpdate={async (id, content) => { await postService.update(id, content); fetchPosts(); }}
                                onDelete={async (id) => { if(window.confirm('Delete?')) { await postService.delete(id); fetchPosts(); }}}
                                onToggleLike={async (id) => { await postService.toggleLike(id); fetchPosts(); }}
                                onCreateComment={async (id, content) => { await postService.createComment(id, content); fetchPosts(); }}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;