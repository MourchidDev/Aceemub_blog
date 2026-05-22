import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, DeleteUserPayload, UpdateUserPayload } from '../api/users';

export const useUsers = () =>
  useQuery({ queryKey: ['users'], queryFn: usersApi.getAll });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DeleteUserPayload }) =>
      usersApi.delete(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
