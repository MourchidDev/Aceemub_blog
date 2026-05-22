import { Article, ArticlePayload } from '../types';
import apiClient from './client'; 



const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const toDisplayArticle = (a: Article) => {
  if (!a) return a;

    let imageUrl = a.coverImage;
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    imageUrl = `${API_BASE_URL}${imageUrl}`;
  } else if (!imageUrl) {
    imageUrl = `/src/assets/ac.png`;
  }
  
  return {
    ...a,
    date: a.createdAt ? new Date(a.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    coverImage: imageUrl,
    excerpt: a.content ? a.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : '',
  };
};

export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    const { data } = await apiClient.get<Article[]>('/articles/all');
    return data.filter(Boolean).map(toDisplayArticle);
  },

  getPublished: async (): Promise<Article[]> => {
    const { data } = await apiClient.get<Article[]>('/articles');
    return data.filter(Boolean).map(toDisplayArticle);
  },

  getById: async (id: string): Promise<Article | undefined> => {
    const { data } = await apiClient.get<Article>(`/articles/${id}`);
    return data ? toDisplayArticle(data) : undefined;
  },

  create: async (payload: ArticlePayload): Promise<Article> => {
    const { data } = await apiClient.post<Article>('/articles', payload);
    return toDisplayArticle(data);
  },
  update: async (id: string, payload: ArticlePayload | FormData): Promise<Article> => {
    const config = payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const { data } = await apiClient.put<Article>(`/articles/${id}`, payload, config);
    return toDisplayArticle(data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/articles/${id}`);
  },

  publish: async (id: string): Promise<Article> => {
    const { data } = await apiClient.post<Article>(`/articles/${id}/publish`);
    return toDisplayArticle(data);
  },

  archive: async (id: string): Promise<Article> => {
    const { data } = await apiClient.post<Article>(`/articles/${id}/archive`);
    return toDisplayArticle(data);
  }
}

