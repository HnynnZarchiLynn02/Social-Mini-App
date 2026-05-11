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
    const [editMedia, setEditMedia] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [editingCommentID, setEditingCommentID] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isTogglingLike, setIsTogglingLike] = useState(false);
    const [commentError, setCommentError] = useState('');

    
    const rawMediaUrl = post.MediaURL || post.media_url;
    const mediaUrlWithBuster = rawMediaUrl 
        ? `${rawMediaUrl}?t=${new Date(post.UpdatedAt || Date.now()).getTime()}` 
        : null;

    useEffect(() => {
        setEditContent(post.content);
    }, [post.content]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateSubmit = async () => {
        const formData = new FormData();
        formData.append('content', editContent);
        if (editMedia) {
            formData.append('media', editMedia);
        }

        try {
            await onUpdate(postID, formData);
            setIsEditing(false);
            setEditMedia(null);
            setPreviewUrl(null);
        } catch {
            setIsEditing(true);
        }
    };

    const handleCancelPostEdit = () => {
        setEditContent(post.content);
        setEditMedia(null);
        setPreviewUrl(null);
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
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-300 mb-6 overflow-hidden h-[620px] flex flex-col ring-1 ring-slate-200">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-300 bg-slate-100">
                <div className="flex items-center">
                    <img
                        src={post.user?.avatar || 'https://via.placeholder.com/40'}
                        className="w-11 h-11 rounded-full mr-3 object-cover border-2 border-white shadow-sm"
                        alt="avatar"
                    />
                    <div>
                        <h4 className="font-bold text-gray-900">{post.user?.username}</h4>
                        <span className="text-xs text-gray-400">
                            {new Date(post.CreatedAt).toLocaleString()}
                        </span>
                    </div>
                </div>

                {isOwner && !isEditing && (
                    <div className="flex gap-4">
                        <button onClick={() => setIsEditing(true)} className="text-blue-600 text-sm font-bold hover:underline">Edit</button>
                        <button onClick={() => onDelete(postID)} className="text-red-500 text-sm font-bold hover:underline">Delete</button>
                    </div>
                )}
            </div>

        
            <div className="px-4 py-3 overflow-y-auto bg-white flex-grow">
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            className="w-full p-3 bg-white border rounded-lg focus:ring-1 focus:ring-blue-400 outline-none resize-none"
                            rows="2"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        
                        <div className="relative group">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Media Preview (Current or New)</label>
                            <div className="h-32 w-full bg-slate-100 rounded-lg overflow-hidden border border-dashed border-slate-300 flex items-center justify-center">
                                {previewUrl ? (
                                    <img src={previewUrl} className="h-full w-full object-cover" alt="new preview" />
                                ) : mediaUrlWithBuster ? (
                                    post.media_type === 'video' ? (
                                        <div className="text-xs text-slate-500">Video: {rawMediaUrl.split('/').pop()}</div>
                                    ) : (
                                        <img src={mediaUrlWithBuster} className="h-full w-full object-cover" alt="current" />
                                    )
                                ) : (
                                    <div className="text-xs text-slate-400">No media attached</div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                className="mt-2 text-xs w-full" 
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button onClick={handleCancelPostEdit} className="bg-gray-200 px-4 py-1 rounded text-sm font-medium">Cancel</button>
                            <button onClick={handleUpdateSubmit} className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium shadow-sm">Save Changes</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={rawMediaUrl ? 'mb-3' : 'h-32 rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-50 to-white px-5 py-4 shadow-inner overflow-y-auto'}>
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed break-words text-[15px]">
                                {post.content}
                            </p>
                        </div>
                        {mediaUrlWithBuster && (
                            <div className="bg-slate-900 border border-slate-300 rounded-xl flex justify-center h-[180px] overflow-hidden mb-2">
                                {post.media_type === 'image' && (
                                    <img src={mediaUrlWithBuster} className="w-full h-full object-cover" alt="post" />
                                )}
                                {post.media_type === 'video' && (
                                    <video key={mediaUrlWithBuster} controls className="w-full h-full object-contain bg-black">
                                        <source src={mediaUrlWithBuster} />
                                    </video>
                                )}
                                {post.media_type === 'audio' && (
                                    <div className="w-full p-6 self-center">
                                        <audio controls className="w-full">
                                            <source src={mediaUrlWithBuster} />
                                        </audio>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

           
            <div className="border-t border-slate-300 px-4 py-2.5 flex items-center gap-3 bg-slate-50">
                <button
                    onClick={handleLikeClick}
                    disabled={isTogglingLike}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${isLiked ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                    {isLiked ? 'Liked' : 'Like'}
                </button>
                <span className="text-sm font-medium text-gray-600">{likeCount} likes</span>
            </div>

        
            <div className="border-t border-slate-300 bg-slate-100 px-4 py-3 h-40 flex flex-col">
                <div className="space-y-3 mb-3 overflow-y-auto pr-1 flex-1">
                    {comments.map((comment) => {
                        const commentID = getID(comment);
                        const isEditingComment = editingCommentID === commentID;
                        return (
                            <div key={commentID} className="flex gap-3">
                                <img src={comment.user?.avatar || 'https://via.placeholder.com/32'} className="w-8 h-8 rounded-full object-cover border" alt="avatar" />
                                <div className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-800">{comment.user?.username}</span>
                                        {Number(getUserID(comment)) === Number(currentUserID) && !isEditingComment && (
                                            <div className="flex gap-2">
                                                <button onClick={() => startCommentEdit(comment)} className="text-xs text-blue-600 font-bold">Edit</button>
                                                <button onClick={() => onDeleteComment(commentID)} className="text-xs text-red-500 font-bold">Delete</button>
                                            </div>
                                        )}
                                    </div>
                                    {isEditingComment ? (
                                        <div className="mt-2">
                                            <textarea className="w-full p-2 text-sm bg-gray-50 border rounded-md outline-none" rows="2" value={editingCommentContent} onChange={(e) => setEditingCommentContent(e.target.value)} />
                                            <div className="flex gap-2 justify-end mt-2">
                                                <button onClick={() => setEditingCommentID(null)} className="text-xs bg-gray-200 px-2 py-1 rounded">Cancel</button>
                                                <button onClick={() => handleCommentUpdate(commentID)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                    <input className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" placeholder="Write a comment..." value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
                    <button disabled={isSubmittingComment} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:bg-blue-300">Comment</button>
                </form>
            </div>
        </div>
    );
};

export default PostCard;