import React from 'react';

const PostCard = ({ post, onEdit, onDelete, currentUserID }) => {
    const isOwner = post.user_id === currentUserID;

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border mb-4">
            <div className="flex items-center mb-3">
                <img src={post.user.avatar || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full mr-3" />
                <div>
                    <h4 className="font-bold">{post.user.username}</h4>
                    <span className="text-xs text-gray-400">{new Date(post.CreatedAt).toLocaleString()}</span>
                </div>
            </div>
            <p className="text-gray-700">{post.content}</p>
            
            {isOwner && (
                <div className="mt-4 flex gap-3 border-t pt-3">
                    <button onClick={() => onEdit(post)} className="text-blue-600 text-sm font-medium">Edit</button>
                    <button onClick={() => onDelete(post.ID)} className="text-red-500 text-sm font-medium">Delete</button>
                </div>
            )}
        </div>
    );
};

export default PostCard;