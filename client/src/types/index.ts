export interface User {
  id?: string;
  _id?: string; // Keep for backward compatibility with MongoDB documents
  email: string;
  role: 'influencer' | 'brand';
  name: string;
  avatar?: string;
  age?: number;
  location?: {
    city?: string;
    state?: string;
    country: string;
  };
  genres?: string[];
  pricePerPost?: number;
  contactEmail?: string;
  connectedPlatforms?: {
    instagram?: { id: string; username: string; connected: boolean };
    youtube?: { id: string; username: string; connected: boolean };
    facebook?: { id: string; username: string; connected: boolean };
  };
  companyName?: string;
  industry?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    avatar?: string;
  };
}

export interface InfluencerStats {
  platform: 'instagram' | 'youtube' | 'facebook';
  followers: number;
  engagementRate: number;
  influenceScore: number;
  confidencePercent: number;
  audienceDemographics: {
    age: { [key: string]: number };
    location: { [key: string]: number };
    interests: { [key: string]: number };
  };
  campaignFitTags: string[];
  aiSummary: string;
  topPosts: Array<{
    id: string;
    likes: number;
    comments: number;
    engagement: number;
    date: Date;
    thumbnail?: string;
  }>;
}

export interface Message {
  _id: string;
  from: User;
  to: User;
  content: string;
  isRead: boolean;
  relatedInfluencer?: User;
  collaborationRequest?: boolean;
  createdAt: string;
}

export interface Shortlist {
  _id: string;
  brandId: string;
  influencerId: User;
  notes?: string;
  createdAt: string;
}

