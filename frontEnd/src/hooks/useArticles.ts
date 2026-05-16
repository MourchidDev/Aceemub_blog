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

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ArticlePayload | FormData }) => 
      articlesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
};

export const usePublishArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesApi.publish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
};

export const useArchiveArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesApi.archive(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
};