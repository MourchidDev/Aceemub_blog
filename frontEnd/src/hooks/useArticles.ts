import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi } from '../api';
import  {ArticlePayload} from '../types';

export const useArticles = () =>
  useQuery({ queryKey: ['articles'], queryFn: articlesApi.getAll });

export const useArticle = (id: string) =>
  useQuery({
    queryKey: ['articles', id],
    queryFn: () => articlesApi.getById(id),
    enabled: !!id,
  });

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ArticlePayload) => articlesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
};