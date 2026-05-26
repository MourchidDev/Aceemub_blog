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

export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function loginWithGoogle(idToken: string) {
  const { data } = await apiClient.post<AuthResponse>('/auth/google', { idToken });
  return data;
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<{ user: AuthUser }>('/auth/me');
  return data.user;
}
