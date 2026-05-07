import React, { useEffect, useState } from 'react';

const getID = (item) => item?.ID || item?.id;
const getUserID = (item) => item?.user_id || item?.UserID || item?.userId;

const PostCard = ({
    post,
    onUpdate,
    onDelete,
    onToggleLike,
    onCreateComment,
    onUpdateComment,
    onDeleteComment,
    currentUserID,
}) => {
    const postID = getID(post);
    const isOwner = Number(getUserID(post)) === Number(currentUserID);
    const comments = post.comments || post.Comments || [];
    const likeCount = post.like_count ?? post.likeCount ?? post.LikeCount ?? 0;
    const isLiked = post.is_liked ?? post.isLiked ?? post.IsLiked ?? false;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [commentContent, setCommentContent] = useState('');
    const [editingCommentID, setEditingCommentID] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isTogglingLike, setIsTogglingLike] = useState(false);
    const [commentError, setCommentError] = useState('');

    useEffect(() => {
        setEditContent(post.content);
    }, [post.content]);

    const handleUpdateSubmit = async () => {
        if (!editContent.trim()) return;
        try {
            await onUpdate(postID, editContent);
            setIsEditing(false);
        } catch {
            setIsEditing(true);
        }
    };

    const handleCancelPostEdit = () => {
        setEditContent(post.content);
        setIsEditing(false);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;
        try {
            setCommentError('');
            setIsSubmittingComment(true);
            await onCreateComment(postID, commentContent);
            setCommentContent('');
        } catch (err) {
            setCommentError(err.response?.data?.error || err.message || 'Failed to create comment');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const startCommentEdit = (comment) => {
        setEditingCommentID(getID(comment));
        setEditingCommentContent(comment.content);
    };

    const handleCommentUpdate = async (commentID) => {
        if (!editingCommentContent.trim()) return;
        try {
            await onUpdateComment(commentID, editingCommentContent);
            setEditingCommentID(null);
            setEditingCommentContent('');
        } catch {
            setEditingCommentID(commentID);
        }
    };

    const handleLikeClick = async () => {
        try {
            setIsTogglingLike(true);
            await onToggleLike(postID);
        } finally {
            setIsTogglingLike(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border mb-6 overflow-hidden">
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

                {isOwner && !isEditing && (
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 text-sm font-bold hover:underline"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(postID)}
                            className="text-red-500 text-sm font-bold hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

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
                                onClick={handleCancelPostEdit}
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

            <div className="border-t px-4 py-3 flex items-center gap-3">
                <button
                    onClick={handleLikeClick}
                    disabled={isTogglingLike}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition disabled:cursor-not-allowed ${
                        isLiked
                            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:text-gray-400'
                    }`}
                >
                    {isLiked ? 'Liked' : 'Like'}
                </button>
                <span className="text-sm font-medium text-gray-600">
                    {likeCount} {Number(likeCount) === 1 ? 'like' : 'likes'}
                </span>
            </div>

            <div className="border-t bg-gray-50 px-4 py-3">
                <div className="space-y-3 mb-3">
                    {comments.map((comment) => {
                        const commentID = getID(comment);
                        const canManageComment = Number(getUserID(comment)) === Number(currentUserID);
                        const isEditingComment = editingCommentID === commentID;

                        return (
                            <div key={commentID} className="flex gap-3">
                                <img
                                    src={comment.user?.avatar || 'https://via.placeholder.com/32'}
                                    className="w-8 h-8 rounded-full object-cover border"
                                    alt="comment avatar"
                                />
                                <div className="flex-1">
                                    <div className="bg-white border rounded-lg px-3 py-2">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-bold text-gray-800 capitalize">
                                                {comment.user?.username || 'User'}
                                            </span>
                                            {canManageComment && !isEditingComment && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => startCommentEdit(comment)}
                                                        className="text-xs font-bold text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteComment(commentID)}
                                                        className="text-xs font-bold text-red-500 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {isEditingComment ? (
                                            <div className="mt-2">
                                                <textarea
                                                    className="w-full p-2 text-sm bg-gray-50 border rounded-md focus:ring-1 focus:ring-blue-400 outline-none resize-none"
                                                    rows="2"
                                                    value={editingCommentContent}
                                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                                />
                                                <div className="flex gap-2 justify-end mt-2">
                                                    <button
                                                        onClick={() => setEditingCommentID(null)}
                                                        className="bg-gray-200 px-3 py-1 rounded text-xs font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleCommentUpdate(commentID)}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">
                                                {comment.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {commentError && (
                    <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {commentError}
                    </div>
                )}

                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                    <input
                        className="flex-1 bg-white border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Write a comment..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <button
                        disabled={isSubmittingComment}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        Comment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostCard;
