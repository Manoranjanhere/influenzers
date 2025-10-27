import axios from 'axios';
import type { AuthResponse, User, InfluencerStats, Message, Shortlist } from '../types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    role: 'influencer' | 'brand';
    name: string;
    [key: string]: any;
  }) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },
};

// Social Media Mock API
export const socialAPI = {
  connectInstagram: async (userId: string) => {
    const response = await api.get(`/mock/instagram/${userId}`);
    return response.data;
  },
  
  connectYouTube: async (userId: string) => {
    const response = await api.get(`/mock/youtube/${userId}`);
    return response.data;
  },
  
  connectFacebook: async (userId: string) => {
    const response = await api.get(`/mock/facebook/${userId}`);
    return response.data;
  },
  
  getStats: async (userId: string) => {
    const response = await api.get<{ platforms: any[] }>(`/mock/stats/${userId}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getInfluencers: async (filters?: {
    location?: string;
    ageRange?: string;
    genre?: string;
    platform?: string;
    followerRange?: string;
    engagementRate?: string;
  }) => {
    const response = await api.get<{ influencers: any[] }>('/users', { params: filters });
    return response.data;
  },
  
  getInfluencer: async (userId: string) => {
    const response = await api.get<{ user: User }>(`/users/${userId}`);
    return response.data;
  },
  
  getInfluencerFull: async (userId: string) => {
    const response = await api.get<{ user: User; stats: InfluencerStats[] }>(`/users/${userId}/full`);
    return response.data;
  },
  
  updateProfile: async (userId: string, data: Partial<User>) => {
    const response = await api.put<{ user: User }>(`/users/${userId}`, data);
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  getMessages: async () => {
    const response = await api.get<{ messages: Message[] }>('/messages');
    return response.data;
  },
  
  sendMessage: async (data: {
    to: string;
    content: string;
    relatedInfluencer?: string;
    collaborationRequest?: boolean;
  }) => {
    const response = await api.post<{ message: Message }>('/messages', data);
    return response.data;
  },
  
  markAsRead: async (messageId: string) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },
};

// Shortlist API
export const shortlistAPI = {
  getShortlist: async () => {
    const response = await api.get<{ shortlist: Shortlist[] }>('/shortlists');
    return response.data;
  },
  
  addToShortlist: async (influencerId: string, notes?: string) => {
    const response = await api.post<{ shortlist: Shortlist }>('/shortlists', { influencerId, notes });
    return response.data;
  },
  
  removeFromShortlist: async (shortlistId: string) => {
    const response = await api.delete(`/shortlists/${shortlistId}`);
    return response.data;
  },
};

export default api;

