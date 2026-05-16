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

export interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF';
  albumId: string;
  createdAt: string;
}

export interface Album {
  id: string;
  title: string;
  eventId: string;
  media: Media[];
  createdAt: string;
}

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';


export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  eventDate: string;
  status: ContentStatus;
  albums: Album[];
  _count?: { albums: number };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  eventDate: string;
  status?: ContentStatus;
  albumTitle?: string;
  images: File[];
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  location?: string;
  eventDate?: string;
  status?: ContentStatus;
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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  level: string;
  city: string;
  photo?: File | null;
}

export interface MembershipCard {
  id: string;
  memberNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  level: string;
  city: string;
  photoDataUrl?: string | null;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { articles: number };
  createdAt?: string;
}

export interface ArticlePayload {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  coverImage?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
