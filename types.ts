export enum UserRole {
  CLIENT = 'CLIENT',
  FREELANCER = 'FREELANCER',
  HYBRID = 'HYBRID'
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: UserRole;
  rating: number;
  walletBalance: number;
}

export interface Service {
  id: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'FIXED' | 'NEGOTIABLE';
  rating: number;
  reviewsCount: number;
  portfolioImages: string[];
  aiMatchScore?: number; // Simulated AI feature
}

export interface Job {
  id: string;
  serviceId: string;
  clientId: string;
  freelancerId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  amount: number;
  title: string;
  date: string;
}

export interface WalletTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'EARNING';
  amount: number;
  date: string;
  status: 'SUCCESS' | 'PENDING';
  description: string;
}