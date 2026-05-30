import apiClient from './client';
import { UserRole } from '../types';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authProvider: 'LOCAL' | 'GOOGLE';
  avatarUrl?: string | null;
  isActive: boolean;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const authApi = {
  login: async (p: LoginPayload) =>
    (await apiClient.post<AuthResponse>("/auth/login", p)).data,
  register: async (p: RegisterPayload) =>
    (await apiClient.post<AuthResponse>("/auth/register", p)).data,
  loginWithGoogle: async (idToken: string) =>
    (await apiClient.post<AuthResponse>("/auth/google", { idToken })).data,
  me: async () => (await apiClient.get<{ user: AuthUser }>("/auth/me")).data.user,
};
