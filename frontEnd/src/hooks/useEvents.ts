import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../api';

export const useEvents = () =>
  useQuery({ queryKey: ['events'], queryFn: eventsApi.getAll });

export const useEvent = (id: number) =>
  useQuery({ queryKey: ['events', id], queryFn: () => eventsApi.getById(id) });
