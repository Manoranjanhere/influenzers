import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import InfluencerDashboard from './pages/InfluencerDashboard';
import BrandDashboard from './pages/BrandDashboard';
import InfluencerProfile from './pages/InfluencerProfile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard/influencer"
            element={
              <PrivateRoute requiredRole="influencer">
                <InfluencerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/brand"
            element={
              <PrivateRoute requiredRole="brand">
                <BrandDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/influencer/:id"
            element={
              <PrivateRoute>
                <InfluencerProfile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

