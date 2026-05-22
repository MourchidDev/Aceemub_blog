import apiClient from './client';
import { UserAccount, UserRole } from '../types';

export type UpdateUserPayload = {
  role?: UserRole;
  isActive?: boolean;
};

export type DeleteUserPayload = {
  password?: string;
  confirmationEmail?: string;
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

  delete: async (id: string, payload: DeleteUserPayload): Promise<void> => {
    await apiClient.delete(`/users/${id}`, { data: payload });
  },
};
