import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import InfluencerStats from '../models/InfluencerStats';
import { generateInfluenceStats } from '../utils/aiAnalysis';

dotenv.config();

const genres = ['Travel', 'Fashion', 'Food', 'Fitness', 'Tech', 'Lifestyle', 'Beauty', 'Photography'];
const locations = [
  { country: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami'] },
  { country: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool'] },
  { country: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'] },
  { country: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal'] },
];

const companyNames = [
  'Global Marketing Co', 'Fresh Brands', 'Digital Innovations', 'NextGen Media',
  'Creative Agency', 'Brand Solutions', 'Marketing Pro', 'Ad Ventures',
  'Brand Connect', 'Marketing Hub'
];

const industries = ['Fashion', 'Tech', 'Food & Beverage', 'Travel', 'Lifestyle', 'Beauty', 'Fitness'];

async function seedData() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/collabrium';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await InfluencerStats.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create influencers
    const influencers = [];
    const hashedPassword = await bcrypt.hash('password123', 10);

    for (let i = 1; i <= 30; i++) {
      const locationObj = locations[Math.floor(Math.random() * locations.length)];
      const city = locationObj.cities[Math.floor(Math.random() * locationObj.cities.length)];
      
      const influencerGenres: string[] = [];
      const numGenres = 1 + Math.floor(Math.random() * 3);
      for (let j = 0; j < numGenres; j++) {
        const genre = genres[Math.floor(Math.random() * genres.length)];
        if (!influencerGenres.includes(genre)) influencerGenres.push(genre);
      }

      const age = 18 + Math.floor(Math.random() * 35);

      const user = await User.create({
        email: `influencer${i}@example.com`,
        password: hashedPassword,
        role: 'influencer',
        name: `Influencer ${i}`,
        avatar: `https://i.pravatar.cc/150?img=${i}`,
        age,
        location: {
          city,
          country: locationObj.country,
        },
        genres: influencerGenres,
        pricePerPost: 100 + Math.floor(Math.random() * 900),
        contactEmail: `influencer${i}@example.com`,
        connectedPlatforms: {
          instagram: {
            id: `ig_${i}`,
            username: `@influencer${i}`,
            connected: true,
          },
          youtube: {
            id: `yt_${i}`,
            username: `Influencer${i} Channel`,
            connected: Math.random() > 0.3,
          },
          facebook: {
            id: `fb_${i}`,
            username: `influencer${i}`,
            connected: Math.random() > 0.5,
          },
        },
      });

      influencers.push(user);
      console.log(`Created influencer ${i}/30`);
    }

    // Create influencer stats
    for (const inf of influencers) {
      // Instagram stats
      if (inf.connectedPlatforms?.instagram?.connected) {
        const followers = Math.floor(Math.random() * 50000) + 2000;
        const posts = Array.from({ length: 12 }, (_, i) => ({
          id: `post_${i}`,
          likes: Math.floor(Math.random() * 5000) + 100,
          comments: Math.floor(Math.random() * 200) + 10,
          engagement: 0,
          date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
          thumbnail: `https://picsum.photos/400/400?random=${i}`,
        }));
        posts.forEach(post => {
          post.engagement = post.likes + post.comments * 2;
        });

        const aiStats = generateInfluenceStats(posts, followers, 'instagram');

        await InfluencerStats.create({
          userId: inf._id,
          platform: 'instagram',
          followers,
          posts,
          ...aiStats,
        });
      }

      // YouTube stats
      if (inf.connectedPlatforms?.youtube?.connected) {
        const followers = Math.floor(Math.random() * 100000) + 5000;
        const posts = Array.from({ length: 10 }, (_, i) => ({
          id: `video_${i}`,
          likes: Math.floor(Math.random() * 10000) + 500,
          comments: Math.floor(Math.random() * 500) + 20,
          engagement: 0,
          date: new Date(Date.now() - i * 10 * 24 * 60 * 60 * 1000),
          thumbnail: `https://picsum.photos/800/450?random=${i + 100}`,
        }));
        posts.forEach(post => {
          post.engagement = post.likes * 1.5 + post.comments * 3;
        });

        const aiStats = generateInfluenceStats(posts, followers, 'youtube');

        await InfluencerStats.create({
          userId: inf._id,
          platform: 'youtube',
          followers,
          posts,
          ...aiStats,
        });
      }

      // Facebook stats
      if (inf.connectedPlatforms?.facebook?.connected) {
        const followers = Math.floor(Math.random() * 30000) + 1000;
        const posts = Array.from({ length: 15 }, (_, i) => ({
          id: `fb_post_${i}`,
          likes: Math.floor(Math.random() * 3000) + 50,
          comments: Math.floor(Math.random() * 150) + 5,
          engagement: 0,
          date: new Date(Date.now() - i * 5 * 24 * 60 * 60 * 1000),
          thumbnail: `https://picsum.photos/600/600?random=${i + 200}`,
        }));
        posts.forEach(post => {
          post.engagement = post.likes + post.comments * 1.5;
        });

        const aiStats = generateInfluenceStats(posts, followers, 'facebook');

        await InfluencerStats.create({
          userId: inf._id,
          platform: 'facebook',
          followers,
          posts,
          ...aiStats,
        });
      }
    }

    // Create brands
    const brands = [];
    for (let i = 1; i <= 10; i++) {
      const brand = await User.create({
        email: `brand${i}@example.com`,
        password: hashedPassword,
        role: 'brand',
        name: `Brand Manager ${i}`,
        avatar: `https://i.pravatar.cc/150?img=${i + 30}`,
        companyName: companyNames[i - 1],
        industry: industries[Math.floor(Math.random() * industries.length)],
      });
      brands.push(brand);
      console.log(`Created brand ${i}/10`);
    }

    console.log('✅ Seed data created successfully!');
    console.log('\n📧 Test credentials:');
    console.log('Influencers: influencer1@example.com / password123');
    console.log('Brands: brand1@example.com / password123');
    console.log('\nPress Ctrl+C to exit');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedData();

