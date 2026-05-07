import { ContactPayload, MembershipPayload } from '../types';
// import apiClient from './client';

export const contactApi = {
  send: async (payload: ContactPayload): Promise<void> => {
    // TODO: await apiClient.post('/contact', payload);
    return Promise.resolve();
  },
};

export const membershipApi = {
  apply: async (payload: MembershipPayload): Promise<void> => {
    // TODO: await apiClient.post('/membership', payload);
    return Promise.resolve();
  },
};
