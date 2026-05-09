import React, { useState, useRef } from 'react';

const CreatePost = ({ onCreate, isPosting, error }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onCreate(content, media);
        if (success) {
            setContent('');
            setMedia(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create Post</h2>
            
            {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <textarea
                className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 border border-transparent focus:border-blue-100 transition-all resize-none min-h-[160px] text-gray-700"
                placeholder="What's on your mind?..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-6 space-y-5">
                <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setMedia(e.target.files?.[0] || null)}
                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white cursor-pointer"
                    />
                </div>

                <button
                    disabled={isPosting || (!content.trim() && !media)}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-200 transition-all"
                >
                    {isPosting ? 'Publishing...' : 'Post Now'}
                </button>
            </div>
        </form>
    );
};

export default CreatePost;