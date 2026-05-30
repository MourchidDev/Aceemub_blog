import apiClient from "./client";
import type { Event } from "@/types";

export const eventsApi = {
  getAll: async () => (await apiClient.get<Event[]>("/events")).data,
  getById: async (id: string) => (await apiClient.get<Event>(`/events/${id}`)).data,
  create: async (payload: FormData | any) => {
    const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    return (await apiClient.post<Event>("/events", payload, config)).data;
  },
  update: async (id: string, payload: FormData | any) => {
    const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    return (await apiClient.put<Event>(`/events/${id}`, payload, config)).data;
  },
  delete: async (id: string) => apiClient.delete(`/events/${id}`),
  addAlbum: async (eventId: string, images: File[], albumTitle?: string) => {
    const form = new FormData();
    images.forEach(img => form.append("images", img));
    if (albumTitle) form.append("albumTitle", albumTitle);
    return (await apiClient.post(`/events/${eventId}/albums`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  },
  addImagesToAlbum: async (eventId: string, albumId: string, images: File[]) => {
    const form = new FormData();
    images.forEach(img => form.append("images", img));
    return (await apiClient.post(`/events/${eventId}/albums/${albumId}/images`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  },
  deleteAlbum: async (eventId: string, albumId: string) =>
    apiClient.delete(`/events/${eventId}/albums/${albumId}`),
  renameAlbum: async (eventId: string, albumId: string, title: string) =>
    (await apiClient.put(`/events/${eventId}/albums/${albumId}`, { title })).data,
  deleteMedia: async (eventId: string, albumId: string, mediaId: string) =>
    apiClient.delete(`/events/${eventId}/albums/${albumId}/media/${mediaId}`),
};
