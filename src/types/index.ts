export interface InterfaceUser {
  id?: number;
  name: string;
  username?: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface InterfaceCategory {
  id?: number;
  name: string;
}

export interface InterfacePost {
  id?: number;
  slug: string;
  title: string;
  categoryId: number;
  excerpt: string;
  content: string;
  createdAt: string;
  userId: number;
  type: 'about' | 'blog' | 'event' | 'service';
}

export interface InterfaceContact {
  id?: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}