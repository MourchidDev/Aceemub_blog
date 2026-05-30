export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type UserRole = "ADMIN" | "EDITOR" | "MEMBER";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  status: ContentStatus;
  authorId: string;
  author?: { id: string; name: string; email: string };
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
  date?: string;
  excerpt?: string;
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
  article?: { id: string; title: string; slug: string };
  status: "PENDING" | "APPROVED" | "REJECTED";
  replies?: Comment[];
  authorName?: string;
}

export interface Media {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO" | "PDF";
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

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authProvider: 'LOCAL' | 'GOOGLE';
  avatarUrl?: string | null;
  isActive: boolean;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
}


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

export interface Announcement {
  id: number;
  title: string;
  date: string;
  category: string;
  desc: string;
  priority: "High" | "Medium" | "Low";
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authProvider: "LOCAL" | "GOOGLE";
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ArticlePayload {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  coverImage?: string;
  status?: ContentStatus;
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
