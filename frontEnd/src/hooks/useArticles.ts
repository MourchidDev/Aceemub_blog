import { useQuery } from '@tanstack/react-query';
import { articlesApi } from '../api';

export const useArticles = () =>
  useQuery({ queryKey: ['articles'], queryFn: articlesApi.getAll });

export const useArticle = (id: number) =>
  useQuery({ queryKey: ['articles', id], queryFn: () => articlesApi.getById(id) });
