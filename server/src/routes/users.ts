import express, { Response } from 'express';
import User from '../models/User';
import InfluencerStats from '../models/InfluencerStats';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user profile
router.put('/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = req.body;
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Get influencers (for brand dashboard)
router.get('/', async (req, res: Response) => {
  try {
    const {
      location,
      ageRange,
      genre,
      platform,
      followerRange,
      engagementRate,
    } = req.query;

    const query: any = { role: 'influencer' };

    if (location) {
      query['location.country'] = location;
    }
    if (ageRange) {
      const [min, max] = (ageRange as string).split('-');
      query.age = { $gte: parseInt(min), $lte: parseInt(max) };
    }
    if (genre) {
      query.genres = { $in: [genre] };
    }
    if (followerRange) {
      const [min, max] = (followerRange as string).split('-');
      // This will be filtered after fetching stats
    }

    const influencers = await User.find(query).select('-password');

    // Get stats for each influencer
    const influencersWithStats = await Promise.all(
      influencers.map(async (inf) => {
        const stats = await InfluencerStats.find({ userId: inf._id });
        
        if (platform && stats.length > 0) {
          const platformStats = stats.find(s => s.platform === platform);
          if (!platformStats) return null;
        }

        const totalFollowers = stats.reduce((sum, s) => sum + s.followers, 0);
        const avgEngagement = stats.reduce((sum, s) => sum + s.engagementRate, 0) / stats.length || 0;

        if (engagementRate && avgEngagement < parseFloat(engagementRate as string)) {
          return null;
        }

        return {
          ...inf.toObject(),
          stats: {
            totalFollowers,
            avgEngagement,
            platforms: stats,
          },
        };
      })
    );

    const filtered = influencersWithStats.filter(Boolean);

    res.json({ influencers: filtered });
  } catch (error) {
    console.error('Get influencers error:', error);
    res.status(500).json({ message: 'Error fetching influencers' });
  }
});

// Get full influencer profile with stats
router.get('/:userId/full', async (req, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user || user.role !== 'influencer') {
      return res.status(404).json({ message: 'Influencer not found' });
    }

    const stats = await InfluencerStats.find({ userId: user._id });

    res.json({
      user,
      stats: stats.map(s => ({
        platform: s.platform,
        followers: s.followers,
        engagementRate: s.engagementRate,
        influenceScore: s.influenceScore,
        confidencePercent: s.confidencePercent,
        audienceDemographics: s.audienceDemographics,
        campaignFitTags: s.campaignFitTags,
        aiSummary: s.aiSummary,
        topPosts: s.posts.slice(0, 3),
      })),
    });
  } catch (error) {
    console.error('Get influencer full error:', error);
    res.status(500).json({ message: 'Error fetching influencer profile' });
  }
});

export default router;

