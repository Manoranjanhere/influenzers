# Collabrium Quick Start Guide

Get Collabrium up and running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- MongoDB running locally (or Atlas account)

## Installation (Choose One Method)

### Method 1: Root Level (Recommended)
```bash
# Install all dependencies
npm run install-all

# Or manually
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Method 2: Individual Directories
```bash
cd server && npm install
cd ../client && npm install
```

## Setup Environment

1. **Create server/.env**:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/collabrium
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

2. **Seed the database**:
```bash
npm run seed
# Or from server directory: npm run seed
```

## Run the Application

### Option 1: Run Both Servers (Recommended)
From the root directory:
```bash
npm run dev
```

### Option 2: Run Separately
Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

## Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Test Credentials

**Influencers:**
- Email: `influencer1@example.com`
- Password: `password123`

**Brands:**
- Email: `brand1@example.com`
- Password: `password123`

## Troubleshooting

**MongoDB Not Running:**
```bash
# Install MongoDB if not installed
# Mac: brew install mongodb-community
# Windows: Download from mongodb.com
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

**Port Already in Use:**
```bash
# Kill port 5000
npx kill-port 5000

# Or change PORT in server/.env
```

**Module Errors:**
```bash
# Clean install
rm -rf node_modules
npm install
```

## Next Steps

1. ✅ Login as influencer: Connect social platforms
2. ✅ View your analytics and 3D visualizations
3. ✅ Login as brand: Filter and search influencers
4. ✅ Request collaboration with influencers
5. ✅ Explore the shortlist feature

## Production Deployment

See README.md for detailed deployment instructions and how to integrate real social media APIs and AI models.

