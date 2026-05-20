export interface Article {
  id: string;          
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  authorId: string;
  author?: { id: string; name: string; email: string };
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
  date?: string;
  image?: string;
  excerpt?: string;
}


export interface Event {
  id: number;
  title: string;
  date: string;
  time?: string;
  location: string;
  type: string;
  image?: string;
  desc?: string;
  slug?: string;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  category: string;
  desc: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MembershipPayload {
  name: string;
  email: string;
  phone: string;
  school: string;
  level: string;
  city: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { articles: number };
  createdAt?: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  articleId: string;
  createdAt: string;
  user?: { id: string; name: string; email?: string };
  article?: { id: string; title: string, slug: string };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  replies?: Comment[];
  authorName?: string;
  authorEmail?: string;
}

export interface ArticlePayload {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  coverImage?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
