import type { Announcement } from "@/types";

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Ouverture des inscriptions pour le SNF 2026",
    date: "23 Fév 2026",
    category: "Événement National",
    desc: "Le Séminaire National de Formation se tiendra à Cotonou. Inscriptions désormais ouvertes en ligne.",
    priority: "High",
  },
  {
    id: 2,
    title: "Bourses d'excellence ACEEMUB : appel à candidatures",
    date: "20 Fév 2026",
    category: "Soutien académique",
    desc: "L'ACEEMUB lance son programme annuel de bourses pour soutenir les étudiants méritants.",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Report de la conférence de Porto-Novo",
    date: "15 Fév 2026",
    category: "Information",
    desc: "Pour des raisons logistiques, la conférence du 20 février est reportée au 5 mars 2026.",
    priority: "Low",
  },
  {
    id: 4,
    title: "Caravane Ramadan 2026 — appel à bénévoles",
    date: "10 Fév 2026",
    category: "Solidarité",
    desc: "Rejoins l'équipe d'organisation de la caravane qui sillonnera 8 villes du Bénin.",
    priority: "Medium",
  },
];

export const announcementsApi = {
  getAll: async () => Promise.resolve(MOCK_ANNOUNCEMENTS),
};
