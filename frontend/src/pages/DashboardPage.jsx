import React, { useState, useEffect, useCallback } from 'react';
import { postService } from '../services/postService';
import PostCard from "../components/feed/PostCard";
import { ActivityCard } from '../components/dashboard/ActivityCard';
import { Loading } from '../components/shared/Loading';

const DashboardPage = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const currentUserID = currentUser?.id || currentUser?.ID;
    const activePost = myPosts.find(p => (p.id || p.ID) === selectedPostId);

    const loadData = useCallback(async () => {
        try {
            const { data } = await postService.getMyPosts();
            setMyPosts(data);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleAction = async (promise) => {
        await promise;
        await loadData();
    };

    if (loading) return <Loading message="Loading your dashboard..." />;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold">Your Activity</h1>
                </header>

                <div className="space-y-6">
                    {myPosts.map(post => (
                        <ActivityCard 
                            key={post.ID || post.id} 
                            post={post} 
                            onClick={() => setSelectedPostId(post.ID || post.id)} 
                        />
                    ))}
                </div>
            </div>

            
            {activePost && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedPostId(null)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[2rem] p-4 max-h-[85vh] overflow-y-auto">
                        <button onClick={() => setSelectedPostId(null)} className="absolute top-5 right-5 font-bold">✕</button>
                        <PostCard 
                            post={activePost}
                            currentUserID={currentUserID}
                            onUpdate={(id, content) => handleAction(postService.update(id, content))}
                            onDelete={(id) => handleAction(postService.delete(id))}
                            onToggleLike={(id) => handleAction(postService.toggleLike(id))}
                            onCreateComment={(id, content) => handleAction(postService.createComment(id, content))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;