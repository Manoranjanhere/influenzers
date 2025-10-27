import mongoose, { Schema, Document } from 'mongoose';

export interface IInfluencerStats extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'instagram' | 'youtube' | 'facebook';
  followers: number;
  posts: Array<{
    id: string;
    likes: number;
    comments: number;
    engagement: number;
    date: Date;
    thumbnail?: string;
  }>;
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
  lastUpdated: Date;
}

const InfluencerStatsSchema = new Schema<IInfluencerStats>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, enum: ['instagram', 'youtube', 'facebook'], required: true },
    followers: { type: Number, default: 0 },
    posts: [
      {
        id: String,
        likes: Number,
        comments: Number,
        engagement: Number,
        date: Date,
        thumbnail: String,
      },
    ],
    engagementRate: { type: Number, default: 0 },
    influenceScore: { type: Number, default: 0 },
    confidencePercent: { type: Number, default: 0 },
    audienceDemographics: {
      age: { type: Map, of: Number },
      location: { type: Map, of: Number },
      interests: { type: Map, of: Number },
    },
    campaignFitTags: [String],
    aiSummary: String,
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IInfluencerStats>('InfluencerStats', InfluencerStatsSchema);

