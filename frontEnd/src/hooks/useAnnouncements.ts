import { useQuery } from '@tanstack/react-query';
import { announcementsApi } from '../api';

export const useAnnouncements = () =>
  useQuery({ queryKey: ['announcements'], queryFn: announcementsApi.getAll });
