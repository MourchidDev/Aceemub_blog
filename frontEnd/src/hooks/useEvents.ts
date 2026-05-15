import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api';
import { CreateEventPayload, UpdateEventPayload } from '../types';

export const useEvents = () =>
  useQuery({ queryKey: ['events'], queryFn: eventsApi.getAll });

export const useEvent = (id: string) =>
  useQuery({ queryKey: ['events', id], queryFn: () => eventsApi.getById(id), enabled: !!id });

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventPayload) => eventsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  });
};

export const useUpdateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateEventPayload) =>
      eventsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  });
};

export const useDeleteEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  });
};

export const useAddAlbum = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, images, albumTitle }: { eventId: string; images: File[]; albumTitle?: string }) =>
      eventsApi.addAlbum(eventId, images, albumTitle),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['events', vars.eventId] }),
  });
};

export const useAddImagesToAlbum = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, albumId, images }: { eventId: string; albumId: string; images: File[] }) =>
      eventsApi.addImagesToAlbum(eventId, albumId, images),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['events', vars.eventId] }),
  });
};

export const useDeleteAlbum = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, albumId }: { eventId: string; albumId: string }) =>
      eventsApi.deleteAlbum(eventId, albumId),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['events', vars.eventId] }),
  });
};
