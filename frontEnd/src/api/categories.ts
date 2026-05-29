import apiClient from "./client";
import type { Category } from "@/types";

export const categoriesApi = {
  getAll: async () => (await apiClient.get<Category[]>("/categories")).data,
  create: async (c: Omit<Category, "id" | "createdAt">) =>
    (await apiClient.post<Category>("/categories", c)).data,
  update: async (id: string, c: Partial<Category>) =>
    (await apiClient.put<Category>(`/categories/${id}`, c)).data,
  delete: async (id: string) => apiClient.delete(`/categories/${id}`),
};
