import apiClient from './client';
import { Event, CreateEventPayload, UpdateEventPayload, Album } from '../types';

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const { data } = await apiClient.get('/events');
    return data;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get(`/events/${id}`);
    return data;
  },

  create: async (payload: CreateEventPayload): Promise<Event> => {
    const form = new FormData();
    form.append('title', payload.title);
    form.append('description', payload.description);
    form.append('location', payload.location);
    form.append('eventDate', payload.eventDate);
    if (payload.status) form.append('status', payload.status);
    if (payload.albumTitle) form.append('albumTitle', payload.albumTitle);
    payload.images.forEach((file) => form.append('images', file));

    const { data } = await apiClient.post('/events', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: string, payload: UpdateEventPayload): Promise<Event> => {
    const { data } = await apiClient.put(`/events/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },

  addAlbum: async (eventId: string, images: File[], albumTitle?: string): Promise<Album> => {
    const form = new FormData();
    if (albumTitle) form.append('albumTitle', albumTitle);
    images.forEach((file) => form.append('images', file));

    const { data } = await apiClient.post(`/events/${eventId}/albums`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  addImagesToAlbum: async (eventId: string, albumId: string, images: File[]): Promise<Album> => {
    const form = new FormData();
    images.forEach((file) => form.append('images', file));

    const { data } = await apiClient.post(`/events/${eventId}/albums/${albumId}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteAlbum: async (eventId: string, albumId: string): Promise<void> => {
    await apiClient.delete(`/events/${eventId}/albums/${albumId}`);
  },

  renameAlbum: async (eventId: string, albumId: string, title: string): Promise<Album> => {
    const { data } = await apiClient.patch(`/events/${eventId}/albums/${albumId}`, { title });
    return data;
  },

  deleteMedia: async (eventId: string, albumId: string, mediaId: string): Promise<void> => {
    await apiClient.delete(`/events/${eventId}/albums/${albumId}/images/${mediaId}`);
  },
};
