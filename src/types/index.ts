export interface InterfaceUser {
  id?: number; // Optional for creation, auto-generated on retrieval
  name: string; // Required for creation and retrieval
  username?: string; // Optional for creation, can be used for authentication
  role?: 'user' | 'admin'; // Optional, to define user roles
  password: string; // Optional for creation, required for authentication
  passwordResetToken?: string; // Optional, for password reset functionality
  passwordResetExpires?: string; // Optional, for password reset functionality
  isActive?: boolean; // Optional, to indicate if the user is active or deactivated
  phone?: string; // Optional, can be used for user profile
  email: string; // Required for creation and retrieval, should be unique
  address?: {
    street: string; // Optional, can be used for user profile
    suite: string; // Optional, can be used for user profile
    city: string; // Optional, can be used for user profile
    state?: string; // Optional, can be used for user profile
    country?: string; // Optional, can be used for user profile
    postalCode?: string; // Optional, can be used for user profile
    zipcode: string; // Optional, can be used for user profile
    geo: {
      lat: string; // Optional, can be used for user profile
      lng: string; // Optional, can be used for user profile
    }; // Optional, can be used for user profile
  }; // Optional, can be used for user profile
  website?: string; // Optional, can be used for user profile
  company?: {
    name: string; // Optional, can be used for user profile
    catchPhrase: string; // Optional, can be used for user profile
    bs: string; // Optional, can be used for user profile
  };
  createdAt?: string; // Optional, auto-generated on creation
  updatedAt?: string; // Optional, auto-generated on update
  profilePicture?: string; // Optional, to store the URL of the user's profile picture
  bio?: string; // Optional, to store a short biography of the user
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  }; // Optional, to store social media links
  lastLogin?: string; // Optional, to track the last login time
  twoFactorEnabled?: boolean; // Optional, to indicate if two-factor authentication is enabled
  twoFactorSecret?: string; // Optional, to store the secret for two-factor authentication
  emailVerified?: boolean; // Optional, to indicate if the user's email is verified
  emailVerificationToken?: string; // Optional, for email verification functionality
  emailVerificationExpires?: string; // Optional, for email verification functionality
  lastPasswordChange?: string; // Optional, to track the last password change time
  loginAttempts?: number; // Optional, to track the number of login attempts for security
  accountLocked?: boolean; // Optional, to indicate if the account is locked due to too many failed login attempts
  preferences?: {
    language?: string; // Optional, to store the user's preferred language
    timezone?: string; // Optional, to store the user's preferred timezone
    notifications?: {
      email?: boolean; // Optional, to indicate if the user wants to receive email notifications
      sms?: boolean; // Optional, to indicate if the user wants to receive SMS notifications
      push?: boolean; // Optional, to indicate if the user wants to receive push notifications
    };
  }; // Optional, to store user preferences
  lastActivity?: string; // Optional, to track the last activity time of the user
  apiKey?: string; // Optional, to store an API key for the user
  apiKeyExpires?: string; // Optional, to indicate when the API key expires
  createdBy?: number; // Optional, to track who created the user
  updatedBy?: number; // Optional, to track who last updated the user
  deletedAt?: string; // Optional, to indicate when the user was deleted (soft delete)
  isDeleted?: boolean; // Optional, to indicate if the user is deleted (soft delete)
  lastLoginIp?: string; // Optional, to store the IP address of the last login
  lastLoginLocation?: {
    city?: string; // Optional, to store the city of the last login
    country?: string; // Optional, to store the country of the last login
  }; // Optional, to store the location of the last login
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