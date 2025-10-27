import express, { Response } from 'express';
import Shortlist from '../models/Shortlist';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get brand's shortlist
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const shortlist = await Shortlist.find({ brandId: req.userId })
      .populate('influencerId', 'name avatar genres location');

    res.json({ shortlist });
  } catch (error) {
    console.error('Get shortlist error:', error);
    res.status(500).json({ message: 'Error fetching shortlist' });
  }
});

// Add to shortlist
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { influencerId, notes } = req.body;

    if (!influencerId) {
      return res.status(400).json({ message: 'Missing influencer ID' });
    }

    const shortlist = await Shortlist.create({
      brandId: req.userId,
      influencerId,
      notes,
    });

    const populated = await Shortlist.findById(shortlist._id).populate('influencerId', 'name avatar genres location');

    res.status(201).json({ shortlist: populated });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already in shortlist' });
    }
    console.error('Add shortlist error:', error);
    res.status(500).json({ message: 'Error adding to shortlist' });
  }
});

// Remove from shortlist
router.delete('/:shortlistId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const shortlist = await Shortlist.findById(req.params.shortlistId);
    if (!shortlist) {
      return res.status(404).json({ message: 'Shortlist item not found' });
    }
    if (shortlist.brandId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await shortlist.deleteOne();

    res.json({ message: 'Removed from shortlist' });
  } catch (error) {
    console.error('Remove shortlist error:', error);
    res.status(500).json({ message: 'Error removing from shortlist' });
  }
});

export default router;

