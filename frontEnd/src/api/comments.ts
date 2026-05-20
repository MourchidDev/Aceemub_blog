import { Comment } from '../types';
import apiClient from './client';

export const commentsApi = {
  getByArticle: async (articleId: string): Promise<Comment[]> => {
    const { data } = await apiClient.get<Comment[]>(`/comments/article/${articleId}`);
    return data;
  },

  getAll: async (): Promise<Comment[]> => {
    const { data } = await apiClient.get<Comment[]>('/comments');
    return data;
  },

  create: async (payload: { content: string; articleId: string }): Promise<Comment> => {
    const { data } = await apiClient.post<Comment>('/comments/comment', payload);
    return data;
  },

  update: async(playload: { id: string, content: string; articleId: string}): Promise<Comment> => {
    const { data } = await apiClient.put<Comment>(`/comments/${playload.id}`, playload);
    return data;
  },
  approve: async (id: string): Promise<Comment> => {
    const { data } = await apiClient.put<Comment>(`/comments/approve/${id}`);
    return data;
  },

  reject: async (id: string): Promise<Comment> => {
    const { data } = await apiClient.put<Comment>(`/comments/reject/${id}`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/comments/${id}`);
  },
};
