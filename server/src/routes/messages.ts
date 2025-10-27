import express, { Response } from 'express';
import Message from '../models/Message';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all messages for current user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({
      $or: [{ from: req.userId }, { to: req.userId }],
    })
      .populate('from', 'name avatar')
      .populate('to', 'name avatar')
      .populate('relatedInfluencer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Create new message
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { to, content, relatedInfluencer, collaborationRequest } = req.body;

    if (!to || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = await Message.create({
      from: req.userId,
      to,
      content,
      relatedInfluencer,
      collaborationRequest,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('from', 'name avatar')
      .populate('to', 'name avatar')
      .populate('relatedInfluencer', 'name avatar');

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Error creating message' });
  }
});

// Mark message as read
router.put('/:messageId/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    if (message.to.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.isRead = true;
    await message.save();

    res.json({ message });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Error marking message as read' });
  }
});

export default router;

