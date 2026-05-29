import apiClient, { API_ORIGIN } from "./client";
import type { Article, ArticlePayload } from "@/types";

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const toDisplayArticle = (a: Article): Article => {
  let imageUrl = a.coverImage ?? null;
  if (imageUrl && imageUrl.startsWith("/uploads/")) {
    imageUrl = `${API_ORIGIN}${imageUrl}`;
  }
  return {
    ...a,
    coverImage: imageUrl,
    date: formatDate(a.createdAt),
    excerpt: a.content ? a.content.replace(/<[^>]+>/g, "").slice(0, 160) + "…" : "",
  };
};

export const articlesApi = {
  getAll: async () =>
    (await apiClient.get<Article[]>("/articles/all")).data.filter(Boolean).map(toDisplayArticle),
  getPublished: async () =>
    (await apiClient.get<Article[]>("/articles")).data.filter(Boolean).map(toDisplayArticle),
  getById: async (id: string) => {
    const { data } = await apiClient.get<Article>(`/articles/${id}`);
    return data ? toDisplayArticle(data) : undefined;
  },
  create: async (payload: ArticlePayload) =>
    toDisplayArticle((await apiClient.post<Article>("/articles", payload)).data),
  update: async (id: string, payload: ArticlePayload | FormData) => {
    const cfg = payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
    return toDisplayArticle((await apiClient.put<Article>(`/articles/${id}`, payload, cfg)).data);
  },
  delete: async (id: string) => apiClient.delete(`/articles/${id}`),
  publish: async (id: string) =>
    toDisplayArticle((await apiClient.post<Article>(`/articles/${id}/publish`)).data),
  archive: async (id: string) =>
    toDisplayArticle((await apiClient.post<Article>(`/articles/${id}/archive`)).data),
};
