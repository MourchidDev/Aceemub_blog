import { Announcement } from '../types';
// import apiClient from './client';

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Ouverture des inscriptions pour le SNF 2026",
    date: "23 Fév 2026",
    category: "Événement National",
    desc: "Le Séminaire National de Formation (SNF) se tiendra cette année à Cotonou. Les inscriptions sont désormais ouvertes en ligne.",
    priority: "High"
  },
  {
    id: 2,
    title: "Bourses d'excellence ACEEMUB : Appel à candidatures",
    date: "20 Fév 2026",
    category: "Soutien Académique",
    desc: "L'ACEEMUB lance son programme annuel de bourses pour soutenir les étudiants méritants en difficulté financière.",
    priority: "Medium"
  },
  {
    id: 3,
    title: "Communiqué : Report de la conférence de Porto-Novo",
    date: "15 Fév 2026",
    category: "Information",
    desc: "Pour des raisons logistiques, la conférence prévue le 20 février est reportée au 5 mars 2026.",
    priority: "Low"
  }
];

export const announcementsApi = {
  getAll: async (): Promise<Announcement[]> => {
    // TODO: return (await apiClient.get('/annonces')).data;
    return Promise.resolve(MOCK_ANNOUNCEMENTS);
  },
};
