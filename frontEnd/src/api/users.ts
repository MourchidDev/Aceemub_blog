import apiClient from './client';
import { UserAccount, UserRole } from '../types';

export type UpdateUserPayload = {
  role?: UserRole;
  isActive?: boolean;
};

export const usersApi = {
  getAll: async (): Promise<UserAccount[]> => {
    const { data } = await apiClient.get<UserAccount[]>('/users');
    return data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<UserAccount> => {
    const { data } = await apiClient.patch<UserAccount>(`/users/${id}`, payload);
    return data;
  },
};
