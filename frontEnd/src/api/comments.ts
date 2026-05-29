import apiClient from "./client";
import type { Comment } from "@/types";

export const commentsApi = {
  getByArticle: async (articleId: string) =>
    (await apiClient.get<Comment[]>(`/comments/article/${articleId}`)).data,
  getAll: async () => (await apiClient.get<Comment[]>("/comments")).data,
  create: async (p: { content: string; articleId: string }) =>
    (await apiClient.post<Comment>("/comments/comment", p)).data,
  update: async (p: { id: string; content: string; articleId: string }) =>
    (await apiClient.put<Comment>(`/comments/${p.id}`, { content: p.content })).data,
  approve: async (id: string) => (await apiClient.put<Comment>(`/comments/approve/${id}`)).data,
  reject: async (id: string) => (await apiClient.put<Comment>(`/comments/reject/${id}`)).data,
  delete: async (id: string) => apiClient.delete(`/comments/${id}`),
};
