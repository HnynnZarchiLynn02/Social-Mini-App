import React, { useState, useRef } from 'react';
import { postService } from '../../services/postService';

const PostForm = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedContent = content.trim();
        if (!trimmedContent && !media) return;

        try {
            setError('');
            setIsPosting(true);
            
            const data = media ? new FormData() : { content: trimmedContent };
            if (media) {
                data.append('content', trimmedContent);
                data.append('media', media);
            }

            await postService.create(data);
            
            setContent('');
            setMedia(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            onPostCreated(); 
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create Post</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            
            <textarea
                className="w-full p-5 bg-gray-50 rounded-2xl border focus:border-blue-500 outline-none resize-none min-h-[160px]"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-6 space-y-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMedia(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-600 file:text-white"
                />
                <button
                    disabled={isPosting || (!content.trim() && !media)}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black disabled:bg-gray-200 transition-all"
                >
                    {isPosting ? 'Publishing...' : 'Post Now'}
                </button>
            </div>
        </form>
    );
};

export default PostForm;