import apiClient from "./client";
import type { AuthUser } from "@/types";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };
export type AuthResponse = { user: AuthUser; token: string };

export const authApi = {
  login: async (p: LoginPayload) =>
    (await apiClient.post<AuthResponse>("/auth/login", p)).data,
  register: async (p: RegisterPayload) =>
    (await apiClient.post<AuthResponse>("/auth/register", p)).data,
  loginWithGoogle: async (idToken: string) =>
    (await apiClient.post<AuthResponse>("/auth/google", { idToken })).data,
  me: async () => (await apiClient.get<{ user: AuthUser }>("/auth/me")).data.user,
};
