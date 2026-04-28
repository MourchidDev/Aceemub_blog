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
