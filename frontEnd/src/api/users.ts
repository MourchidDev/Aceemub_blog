import apiClient from "./client";
import type { AuthUser } from "@/types";

export type UpdateUserPayload = { name?: string; email?: string; role?: AuthUser["role"]; isActive?: boolean };
export type DeleteUserPayload = { reason?: string };

export const usersApi = {
  getAll: async () => (await apiClient.get<AuthUser[]>("/users")).data,
  updateRole: async (id: string, role: AuthUser["role"]) =>
    (await apiClient.put<AuthUser>(`/users/${id}/role`, { role })).data,
  toggleActive: async (id: string, isActive: boolean) =>
    (await apiClient.put<AuthUser>(`/users/${id}/active`, { isActive })).data,
  update: async (id: string, payload: UpdateUserPayload) =>
    (await apiClient.put<AuthUser>(`/users/${id}`, payload)).data,
  delete: async (id: string, payload?: DeleteUserPayload) =>
    apiClient.delete(`/users/${id}`, { data: payload }),
};
