export interface User {
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

export interface Category {
  id?: number;
  name: string;
}

export interface Post {
  id?: number;
  slug: string;
  title: string;
  categoryId: number;
  excerpt: string;
  content: string;
  createdAt: string;
  userId: string;
}