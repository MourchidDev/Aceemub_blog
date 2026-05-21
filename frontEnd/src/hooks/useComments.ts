import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';

export const useCommentsByArticle = (articleId: string) =>
  useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => commentsApi.getByArticle(articleId),
    enabled: !!articleId,
  });

export const useAllComments = () =>
  useQuery({ queryKey: ['comments'], queryFn: commentsApi.getAll });

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { content: string; articleId: string }) =>
      commentsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  });
};

export const useApproveComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => commentsApi.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  });
};

export const useRejectComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => commentsApi.reject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => commentsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  });

};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; content: string; articleId: string }) =>
      commentsApi.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  });
};