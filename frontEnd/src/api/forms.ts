import { ContactPayload, MembershipPayload } from '../types';
// import apiClient from './client';

export const contactApi = {
  send: async (payload: ContactPayload): Promise<void> => {
    // TODO: await apiClient.post('/contact', payload);
    console.log('[mock] contact sent', payload);
    return Promise.resolve();
  },
};

export const membershipApi = {
  apply: async (payload: MembershipPayload): Promise<void> => {
    // TODO: await apiClient.post('/membership', payload);
    console.log('[mock] membership applied', payload);
    return Promise.resolve();
  },
};
