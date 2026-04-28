import { Article } from '../types';
// import apiClient from './client'; // décommenter quand le backend est prêt

const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Comment concilier excellence académique et pratique religieuse ?",
    category: "Réussite",
    date: "22 Fév 2026",
    image: "https://picsum.photos/seed/study/800/600",
    excerpt: "Découvrez nos conseils pratiques pour organiser votre temps entre vos révisions et vos moments de dévotion.",
    author: "Dr. Moussa G.",
    content: `
      <p>La vie d'étudiant est souvent marquée par un rythme intense...</p>
      <h3>1. L'intention (Niyyah) : Le moteur de la réussite</h3>
      <p>Tout commence par l'intention. En Islam, la quête du savoir est une obligation pour chaque musulman.</p>
      <h3>2. La gestion du temps : Le secret des meilleurs</h3>
      <p>Le découpage de la journée par les cinq prières quotidiennes est un cadre magnifique pour organiser son travail.</p>
      <blockquote>"Le savoir est une lumière qu'Allah projette dans le cœur."</blockquote>
      <h3>3. L'équilibre spirituel</h3>
      <p>Ne négligez pas votre cœur. Un esprit stressé par les examens trouve son apaisement dans le Dhikr.</p>
    `
  },
  {
    id: 2,
    title: "L'importance de la fraternité dans le milieu estudiantin",
    category: "Spiritualité",
    date: "18 Fév 2026",
    image: "https://picsum.photos/seed/community/800/600",
    excerpt: "Pourquoi s'entourer de compagnons vertueux est la clé pour traverser les années d'université avec sérénité.",
    author: "Oustaz Ibrahim"
  },
  {
    id: 3,
    title: "Retour sur le Séminaire National de Formation 2025",
    category: "Actualités",
    date: "10 Fév 2026",
    image: "https://picsum.photos/seed/event/800/600",
    excerpt: "Plus de 500 étudiants réunis à Cotonou pour une semaine d'échanges intenses et de formation.",
    author: "Bureau National"
  },
  {
    id: 4,
    title: "Les défis de la jeunesse musulmane au 21ème siècle",
    category: "Société",
    date: "05 Fév 2026",
    image: "https://picsum.photos/seed/youth/800/600",
    excerpt: "Analyse des enjeux contemporains et des opportunités pour les jeunes croyants dans un monde globalisé.",
    author: "Mariam A."
  },
  {
    id: 5,
    title: "Guide : Préparer son Ramadan sur le campus",
    category: "Spiritualité",
    date: "01 Fév 2026",
    image: "https://picsum.photos/seed/ramadan/800/600",
    excerpt: "Astuces pour la gestion des repas, du sommeil et des examens pendant le mois béni.",
    author: "Comité Social"
  },
  {
    id: 6,
    title: "L'ACEEMUB lance son nouveau portail numérique",
    category: "Actualités",
    date: "25 Jan 2026",
    image: "https://picsum.photos/seed/tech/800/600",
    excerpt: "Une étape majeure pour la digitalisation de nos services et la communication avec nos membres.",
    author: "Équipe Com"
  }
];

export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    // TODO: return (await apiClient.get('/articles')).data;
    return Promise.resolve(MOCK_ARTICLES);
  },

  getById: async (id: number): Promise<Article | undefined> => {
    // TODO: return (await apiClient.get(`/articles/${id}`)).data;
    return Promise.resolve(MOCK_ARTICLES.find(a => a.id === id));
  },
};
