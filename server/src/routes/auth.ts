import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['influencer', 'brand']),
    body('name').notEmpty().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, role, name, avatar, ...additionalFields } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        role,
        name,
        avatar: avatar || '',
        ...additionalFields,
      });

      // Generate JWT
      const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
      const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '7d' });

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// Login
router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
      const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '7d' });

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; role: string };

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router;

