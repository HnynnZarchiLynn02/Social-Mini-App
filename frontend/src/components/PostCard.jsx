import React, { useState } from 'react';

const PostCard = ({ post, onUpdate, onDelete, currentUserID }) => {
    // ပိုင်ရှင် ဟုတ်မဟုတ် စစ်ဆေးခြင်း (Type မတူတာမျိုးမဖြစ်အောင် Number ပြောင်းစစ်တာ ပိုစိတ်ချရပါတယ်)
    const isOwner = Number(post.user_id) === Number(currentUserID);
    
    // Edit Mode အတွက် State များ
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);

    const handleUpdateSubmit = () => {
        onUpdate(post.ID, editContent);
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border mb-6 overflow-hidden">
            {/* --- Header: User Info --- */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <img 
                        src={post.user?.avatar || 'https://via.placeholder.com/40'} 
                        className="w-10 h-10 rounded-full mr-3 object-cover border" 
                        alt="avatar"
                    />
                    <div>
                        <h4 className="font-bold text-gray-900 capitalize">{post.user?.username}</h4>
                        <span className="text-xs text-gray-400">
                            {new Date(post.CreatedAt).toLocaleString()}
                        </span>
                    </div>
                </div>
                
                {/* ပိုင်ရှင်ဖြစ်မှသာ ပြမည့် Actions (Edit/Delete) */}
                {isOwner && !isEditing && (
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="text-blue-600 text-sm font-bold hover:underline"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => onDelete(post.ID)} 
                            className="text-red-500 text-sm font-bold hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* --- Body: Content --- */}
            <div className="px-4 pb-3">
                {isEditing ? (
                    <div className="mt-2 bg-gray-50 p-2 rounded-lg border">
                        <textarea 
                            className="w-full p-2 bg-white border rounded-md focus:ring-1 focus:ring-blue-400 outline-none resize-none"
                            rows="3"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2 justify-end">
                            <button 
                                onClick={() => setIsEditing(false)} 
                                className="bg-gray-200 px-4 py-1 rounded text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdateSubmit} 
                                className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                    </p>
                )}
            </div>

            {/* --- Media: Photo/Video Display --- */}
            {post.media_url && (
                <div className="bg-gray-100 border-y flex justify-center">
                    {post.media_type === 'image' && (
                        <img src={post.media_url} className="max-w-full h-auto max-h-[500px]" alt="post" />
                    )}
                    {post.media_type === 'video' && (
                        <video controls className="w-full max-h-[500px] bg-black">
                            <source src={post.media_url} />
                        </video>
                    )}
                    {post.media_type === 'audio' && (
                        <div className="w-full p-6">
                            <audio controls className="w-full"><source src={post.media_url} /></audio>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;