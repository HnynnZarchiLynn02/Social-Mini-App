import api from '../api/axios';

export const postService = {
    getAll: () => api.get('/posts'),
    getMyPosts: () => api.get('/my-posts'),
    create: (data) => {
        if (data instanceof FormData) return api.post('/posts', data);
        return api.post('/posts', { content: data.content });
    },
    
    update: (id, formData) => {
   
    if (formData instanceof FormData) {
        return api.put(`/posts/${id}`, formData); 
    }
   
    return api.put(`/posts/${id}`, { content: formData });
},
    delete: (id) => api.delete(`/posts/${id}`),
    toggleLike: (id) => api.post(`/posts/${id}/like`),
    createComment: (id, content) => api.post(`/posts/${id}/comments`, { content }),
    updateComment: (id, content) => api.put(`/comments/${id}`, { content }),
    deleteComment: (id) => api.delete(`/comments/${id}`),
};