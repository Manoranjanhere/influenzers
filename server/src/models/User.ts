import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'influencer' | 'brand';
  name: string;
  avatar?: string;
  // Influencer fields
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
  // Brand fields
  companyName?: string;
  industry?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['influencer', 'brand'], required: true },
    name: { type: String, required: true },
    avatar: String,
    age: Number,
    location: {
      city: String,
      state: String,
      country: String,
    },
    genres: [String],
    pricePerPost: Number,
    contactEmail: String,
    connectedPlatforms: {
      instagram: { id: String, username: String, connected: Boolean },
      youtube: { id: String, username: String, connected: Boolean },
      facebook: { id: String, username: String, connected: Boolean },
    },
    companyName: String,
    industry: String,
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);

