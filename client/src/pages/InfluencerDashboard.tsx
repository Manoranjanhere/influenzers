import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, socialAPI } from '../utils/api';
import { motion } from 'framer-motion';
import EngagementChart from '../components/charts/EngagementChart';
import FollowerGrowthChart from '../components/charts/FollowerGrowthChart';
import EngagementDistributionChart from '../components/charts/EngagementDistributionChart';
import InfluenceTerrain from '../components/visualizations/InfluenceTerrain';
import RadialEngagementChart from '../components/visualizations/RadialEngagementChart';
import jsPDF from 'jspdf';
import type { InfluencerStats } from '../types';

const InfluencerDashboard = () => {
  const { user, updateUser, logout } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!user) return;
    const userId = user.id || user._id;
    if (!userId) {
      console.error('User ID not found');
      setLoading(false);
      return;
    }
    try {
      const data = await socialAPI.getStats(userId);
      setStats(data.platforms);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectPlatform = async (platform: 'instagram' | 'youtube' | 'facebook') => {
    if (!user) return;
    const userId = user.id || user._id;
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    setConnecting(platform);
    try {
      if (platform === 'instagram') {
        await socialAPI.connectInstagram(userId);
      } else if (platform === 'youtube') {
        await socialAPI.connectYouTube(userId);
      } else if (platform === 'facebook') {
        await socialAPI.connectFacebook(userId);
      }
      await loadStats();
      // Update user connected platforms
      const updatedPlatforms = {
        ...user.connectedPlatforms,
        [platform]: {
          ...user.connectedPlatforms?.[platform],
          connected: true,
        },
      };
      updateUser({ ...user, connectedPlatforms: updatedPlatforms });
    } catch (error) {
      console.error('Error connecting platform:', error);
    } finally {
      setConnecting(null);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Influencer Analytics Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${user?.name}`, 20, 35);
    doc.text(`Email: ${user?.email}`, 20, 40);
    doc.text(`Location: ${user?.location?.city}, ${user?.location?.country}`, 20, 45);
    doc.text(`Genres: ${user?.genres?.join(', ')}`, 20, 50);
    
    let y = 65;
    stats.forEach((stat) => {
      doc.setFontSize(14);
      doc.text(stat.platform.charAt(0).toUpperCase() + stat.platform.slice(1), 20, y);
      doc.setFontSize(10);
      doc.text(`Followers: ${stat.followers.toLocaleString()}`, 20, y + 5);
      doc.text(`Engagement Rate: ${stat.engagementRate}%`, 20, y + 10);
      doc.text(`Influence Score: ${stat.influenceScore}/100`, 20, y + 15);
      y += 25;
    });

    doc.save(`${user?.name}_report.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const chartData = stats.flatMap((stat) =>
    stat.posts.map((post: any) => ({
      date: new Date(post.date).toLocaleDateString(),
      engagement: post.engagement,
    }))
  );

  const platformStats = stats.map((stat) => ({
    platform: stat.platform,
    likes: stat.posts.reduce((sum: number, post: any) => sum + post.likes, 0),
    comments: stat.posts.reduce((sum: number, post: any) => sum + post.comments, 0),
  }));

  const terrainData = stats.flatMap((stat, index) =>
    stat.posts.slice(0, 10).map((post: any, i: number) => ({
      x: Math.cos((index * Math.PI * 2) / stats.length) * 2,
      y: post.engagement / 100,
      z: Math.sin((index * Math.PI * 2) / stats.length) * 2,
      value: post.engagement,
      label: stat.platform,
    }))
  );

  const avgInfluenceScore = stats.length > 0
    ? Math.round(stats.reduce((sum, s) => sum + s.influenceScore, 0) / stats.length)
    : 0;

  const avgConfidence = stats.length > 0
    ? Math.round(stats.reduce((sum, s) => sum + s.confidencePercent, 0) / stats.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Collabrium</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-start gap-6">
            <img
              src={user?.avatar || 'https://i.pravatar.cc/150'}
              alt={user?.name}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>
              {user?.location && (
                <p className="text-gray-600 mb-2">
                  📍 {user.location.city}, {user.location.country}
                </p>
              )}
              {user?.genres && (
                <p className="text-gray-600 mb-2">
                  {user.genres.join(', ')}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {['instagram', 'youtube', 'facebook'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => connectPlatform(platform as any)}
                    disabled={connecting === platform}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      user?.connectedPlatforms?.[platform as 'instagram' | 'youtube' | 'facebook']?.connected
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {connecting === platform ? 'Connecting...' : platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 2D Charts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Engagement Trend</h3>
            <EngagementChart data={chartData} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Platform Comparison</h3>
            <EngagementDistributionChart data={platformStats} />
          </div>
        </div>

        {/* 3D Visualization */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">3D Engagement Visualization</h3>
          {terrainData.length > 0 ? (
            <InfluenceTerrain data={terrainData} />
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Connect platforms to see 3D visualization</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* AI Analysis Card */}
          {stats.length > 0 && (
            <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm opacity-80">Influence Score</p>
                  <p className="text-3xl font-bold">{avgInfluenceScore}/100</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Confidence</p>
                  <p className="text-2xl font-bold">{avgConfidence}%</p>
                </div>
                {stats[0]?.aiSummary && (
                  <p className="text-sm mt-4">{stats[0].aiSummary}</p>
                )}
              </div>
            </div>
          )}

          {/* Top Posts */}
          {stats.length > 0 && stats[0].posts && (
            <div className="bg-white rounded-xl shadow-md p-6 col-span-2">
              <h3 className="text-xl font-semibold mb-4">Top Posts</h3>
              <div className="grid grid-cols-3 gap-4">
                {stats[0].posts.slice(0, 3).map((post: any, index: number) => (
                  <div key={index} className="text-center">
                    <img
                      src={post.thumbnail || 'https://via.placeholder.com/200'}
                      alt={`Post ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-600">
                      ❤️ {post.likes.toLocaleString()} | 💬 {post.comments.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={exportPDF}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            📄 Export PDF Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;

