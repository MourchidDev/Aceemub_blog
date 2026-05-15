import { ContactPayload, MembershipCard, MembershipPayload } from '../types';
import apiClient from './client';

export const contactApi = {
  send: async (payload: ContactPayload): Promise<void> => {
    // TODO: await apiClient.post('/contact', payload);
    return Promise.resolve();
  },
};

export const membershipApi = {
  apply: async (payload: MembershipPayload): Promise<MembershipCard> => {
    const formData = new FormData();
    formData.append('firstName', payload.firstName);
    formData.append('lastName', payload.lastName);
    formData.append('email', payload.email);
    formData.append('phone', payload.phone);
    formData.append('school', payload.school);
    formData.append('level', payload.level);
    formData.append('city', payload.city);
    if (payload.photo) formData.append('photo', payload.photo);

    const { data } = await apiClient.post<{ card: MembershipCard }>('/membership/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.card;
  },
  get: async (cardId: string): Promise<MembershipCard> => {
    const { data } = await apiClient.get<{ card: MembershipCard }>(`/membership/${cardId}`);
    return data.card;
  },
  getMine: async (): Promise<MembershipCard | null> => {
    try {
      const { data } = await apiClient.get<{ card: MembershipCard }>('/membership/me');
      return data.card;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 404) return null;
      }
      throw error;
    }
  },
  getPdfUrl: (cardId: string) => {
    const baseURL = apiClient.defaults.baseURL ?? 'http://localhost:5000/api';
    return `${baseURL}/membership/${cardId}/pdf`;
  },
  downloadPdf: async (card: MembershipCard): Promise<void> => {
    const response = await apiClient.get(`/membership/${card.id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `carte-membre-${card.memberNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
