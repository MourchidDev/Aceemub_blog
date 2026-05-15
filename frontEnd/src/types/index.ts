export interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  author?: string;
  content?: string;
  slug?: string;
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
