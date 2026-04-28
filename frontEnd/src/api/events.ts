import { Event } from '../types';
// import apiClient from './client';

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Conférence : Islam et Modernité",
    date: "15 Mars 2026",
    time: "10:00 - 13:00",
    location: "Amphi Idriss Déby, UAC",
    type: "Conférence",
    image: "https://picsum.photos/seed/ev1/800/500",
    desc: "Une réflexion profonde sur les défis de la pratique religieuse dans le monde contemporain."
  },
  {
    id: 2,
    title: "Journée de Solidarité Ramadan",
    date: "28 Mars 2026",
    time: "09:00 - 17:00",
    location: "Siège National ACEEMUB",
    type: "Social",
    image: "https://picsum.photos/seed/ev2/800/500",
    desc: "Distribution de kits alimentaires et moments de partage avec les plus démunis."
  },
  {
    id: 3,
    title: "Atelier Soft Skills & Leadership",
    date: "05 Avril 2026",
    time: "14:00 - 18:00",
    location: "Parakou, Centre Culturel",
    type: "Formation",
    image: "https://picsum.photos/seed/ev3/800/500",
    desc: "Développez vos compétences en communication et gestion de projet pour votre carrière."
  },
  {
    id: 4,
    title: "Tournoi de Foot Inter-Sections",
    date: "12 Avril 2026",
    time: "08:00 - 18:00",
    location: "Stade de l'Amitié, Cotonou",
    type: "Sport",
    image: "https://picsum.photos/seed/ev4/800/500",
    desc: "Renforcez la fraternité à travers le sport. Toutes les sections sont invitées."
  }
];

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    // TODO: return (await apiClient.get('/events')).data;
    return Promise.resolve(MOCK_EVENTS);
  },

  getById: async (id: number): Promise<Event | undefined> => {
    // TODO: return (await apiClient.get(`/events/${id}`)).data;
    return Promise.resolve(MOCK_EVENTS.find(e => e.id === id));
  },
};
