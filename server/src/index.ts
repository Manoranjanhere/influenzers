import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './utils/database';
import authRoutes from './routes/auth';
import socialMockRoutes from './routes/socialMock';
import userRoutes from './routes/users';
import messageRoutes from './routes/messages';
import shortlistRoutes from './routes/shortlists';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mock', socialMockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/shortlists', shortlistRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Collabrium API is running' });
});

// Connect to database and start server
const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;

