import { Article, ArticlePayload } from '../types';
import apiClient from './client'; 



const toDisplayArticle = (a: Article) => ({
  ...a,
  date: new Date(a.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
  image: a.coverImage ?? `https://picsum.photos/seed/${a.slug}/800/600`,
  excerpt: a.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...',
});

export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    const { data } = await apiClient.get<Article[]>('/articles');
    return data.map(toDisplayArticle);
  },

  getById: async (id: string): Promise<Article | undefined> => {
    const { data } = await apiClient.get<Article>(`/articles/${id}`);
    return toDisplayArticle(data);
  },

  create: async (payload: ArticlePayload): Promise<Article> => {
    const { data } = await apiClient.post<Article>('/articles', payload);
    return toDisplayArticle(data);
  },
}


