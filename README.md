# Collabrium

**Empowering Collaboration Between Brands and Influencers**

Collabrium = "Collaboration" + "Atrium". A modern digital atrium where brands and influencers meet, verify, and collaborate. Premium, memorable, and brandable.

## 🎯 Overview

Collabrium is a full-stack web platform that connects brands with influencers. It features:

- **2D Analytics Charts**: Line charts for engagement trends, bar charts for platform comparisons
- **3D Visualizations**: Interactive 3D engagement terrains and radial charts using react-three-fiber
- **AI-Powered Analysis**: Mock AI module that calculates influence scores, engagement rates, and audience demographics
- **Mock Social Connectors**: Simulated Instagram, YouTube, and Facebook API integrations
- **Role-Based Authentication**: Separate dashboards for influencers and brands
- **Real-Time Messaging**: In-app messaging system for collaboration requests
- **Shortlisting**: Brands can save and manage favorite influencers

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for 2D data visualization
- **react-three-fiber** + **@react-three/drei** for 3D visualizations
- **Three.js** for 3D graphics
- **Vite** for build tooling
- **jsPDF** for PDF report generation

### Backend
- **Node.js** with Express
- **TypeScript**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## 📁 Project Structure

```
collabrium/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── utils/         # API utilities
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── utils/         # Utilities (AI analysis, DB connection)
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Step 1: Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Environment Setup

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/collabrium
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

**For MongoDB Atlas**, replace `MONGO_URI` with your connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/collabrium
```

### Step 3: Seed Database

Run the seed script to populate the database with sample data:

```bash
cd server
npm run seed
```

This creates:
- 30 influencers with connected social platforms
- 10 brands
- Mock statistics and analytics for each influencer

**Test Credentials:**
- Influencers: `influencer1@example.com` / `password123`
- Brands: `brand1@example.com` / `password123`

### Step 4: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

Server will start on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

Frontend will start on `http://localhost:3000`

Visit `http://localhost:3000` to access the application.

## 📖 Features

### Landing Page
- Hero section with clear value proposition
- 3-step process visualization (Connect → Analyze → Collaborate)
- Featured influencers carousel
- CTA for early adopters

### Authentication
- Role-based signup (Influencer / Brand)
- JWT token-based authentication
- Protected routes with role verification

### Influencer Dashboard
- **Profile Management**: Edit genres, location, contact info, pricing
- **Social Media Connection**: Connect Instagram, YouTube, Facebook accounts (mock)
- **2D Analytics**:
  - Engagement trend line chart
  - Platform comparison bar chart
  - Follower growth visualization
- **3D Visualizations**:
  - Interactive engagement terrain (3D scatter plot)
  - Radial engagement chart (3D platform rings)
- **AI Analysis Card**: Influence score, confidence percentage, AI summary
- **Top Posts**: Gallery of highest-performing posts
- **PDF Export**: Generate downloadable analytics report

### Brand Dashboard
- **Advanced Filters**:
  - Location (country/state/city)
  - Age range
  - Genre/niche
  - Platform (Instagram/YouTube/Facebook)
  - Follower range
  - Minimum engagement rate
- **Influencer Search**: Browse and filter influencers
- **Shortlist Management**: Save favorite influencers
- **View Profiles**: Access full influencer analytics
- **Request Collaboration**: Send messages to influencers

### Influencer Profile View (Brand)
- Complete influencer profile
- All 2D and 3D visualizations
- AI analysis and campaign fit tags
- Collaboration request button
- Contact information

### Messaging System
- In-app messaging between brands and influencers
- Collaboration requests
- Message read status tracking

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Social Media (Mock)
- `GET /api/mock/instagram/:userId` - Connect Instagram and fetch data
- `GET /api/mock/youtube/:userId` - Connect YouTube and fetch data
- `GET /api/mock/facebook/:userId` - Connect Facebook and fetch data
- `GET /api/mock/stats/:userId` - Get all influencer stats

### Users
- `GET /api/users` - Get influencers (with filters)
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/full` - Get full influencer profile with stats
- `PUT /api/users/:userId` - Update user profile

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:messageId/read` - Mark as read

### Shortlists
- `GET /api/shortlists` - Get shortlist
- `POST /api/shortlists` - Add to shortlist
- `DELETE /api/shortlists/:shortlistId` - Remove from shortlist

## 🔌 Integration Points

### Replace Mock Social APIs

The mock social connectors are located in `server/src/routes/socialMock.ts`. To integrate real APIs:

1. **Instagram Graph API**:
   ```typescript
   // Replace GET /api/mock/instagram/:userId
   import axios from 'axios';
   const instagram = await axios.get(`https://graph.instagram.com/v18.0/${userId}`, {
     params: { access_token: ACCESS_TOKEN }
   });
   ```

2. **YouTube Data API v3**:
   ```typescript
   // Replace GET /api/mock/youtube/:userId
   const youtube = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
     params: { key: API_KEY, id: channelId }
   });
   ```

3. **Facebook Graph API**:
   ```typescript
   // Replace GET /api/mock/facebook/:userId
   const facebook = await axios.get(`https://graph.facebook.com/v18.0/${userId}`, {
     params: { access_token: ACCESS_TOKEN }
   });
   ```

### Replace AI Analysis Module

The AI analysis module is in `server/src/utils/aiAnalysis.ts`. To integrate real AI:

**Option 1: OpenAI API**
```typescript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Analyze influence metrics..." }]
});
```

**Option 2: Custom ML Model**
- Train a model on historical influencer data
- Deploy using TensorFlow.js or PyTorch
- Call model endpoint from `generateInfluenceStats` function

**Option 3: AWS Comprehend**
```typescript
import { ComprehendClient } from '@aws-sdk/client-comprehend';
const client = new ComprehendClient({ region: 'us-east-1' });
// Use for sentiment analysis and categorization
```

## 🧪 Testing

Run the test suite:
```bash
cd server
npm test
```

Run linting:
```bash
# Server
cd server
npm run lint

# Client
cd client
npm run lint
```

## 📦 Building for Production

### Build Backend
```bash
cd server
npm run build
npm start
```

### Build Frontend
```bash
cd client
npm run build
# Output in client/dist
```

## 🔒 Security Considerations

1. **Change JWT_SECRET**: Use a strong, randomly generated secret in production
2. **Environment Variables**: Never commit `.env` files
3. **CORS**: Configure CORS properly for production domains
4. **Input Validation**: Already implemented with express-validator
5. **Password Hashing**: Uses bcryptjs with salt rounds
6. **Rate Limiting**: Consider adding express-rate-limit
7. **HTTPS**: Always use HTTPS in production

## 📝 Design Decisions

### 3D Visualizations
- Used `react-three-fiber` for declarative 3D scene management
- `@react-three/drei` for pre-built helpers (OrbitControls, etc.)
- Performance optimized with lazy loading
- Mobile fallback: Simplified 2D charts on small screens

### State Management
- React Context for auth state
- Local component state for UI
- API calls via axios with interceptors

### Styling
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- Responsive design with mobile-first approach

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running locally: `mongod`
- Or provide correct Atlas connection string

**Port Already in Use**
- Change PORT in `server/.env`
- Or kill process: `npx kill-port 5000`

**Module Not Found**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**3D Visualizations Not Loading**
- Check browser console for Three.js errors
- Ensure WebGL is enabled in browser

## 🎨 Customization

### Theme Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Your brand colors
    600: '#your-color'
  }
}
```

### Adding More Platforms
1. Add platform to `connectedPlatforms` in User model
2. Create mock route in `server/src/routes/socialMock.ts`
3. Add connect button in InfluencerDashboard
4. Update 3D visualization data

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for connecting brands and influencers**

