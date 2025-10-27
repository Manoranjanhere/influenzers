import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usersAPI, messagesAPI } from '../utils/api';
import { motion } from 'framer-motion';
import EngagementChart from '../components/charts/EngagementChart';
import EngagementDistributionChart from '../components/charts/EngagementDistributionChart';
import InfluenceTerrain from '../components/visualizations/InfluenceTerrain';
import RadialEngagementChart from '../components/visualizations/RadialEngagementChart';
import type { User, InfluencerStats } from '../types';

const InfluencerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [influencer, setInfluencer] = useState<User | null>(null);
  const [stats, setStats] = useState<InfluencerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    if (!id) return;
    try {
      const data = await usersAPI.getInfluencerFull(id);
      setInfluencer(data.user);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!id || !message) return;
    try {
      await messagesAPI.sendMessage({
        to: id,
        content: message,
        relatedInfluencer: id,
        collaborationRequest: true,
      });
      setShowMessageModal(false);
      setMessage('');
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Influencer not found</p>
      </div>
    );
  }

  const chartData = stats.flatMap((stat) =>
    stat.topPosts.map((post) => ({
      date: new Date(post.date).toLocaleDateString(),
      engagement: post.engagement,
    }))
  );

  const platformStats = stats.map((stat) => ({
    platform: stat.platform,
    likes: stat.topPosts.reduce((sum, post) => sum + post.likes, 0),
    comments: stat.topPosts.reduce((sum, post) => sum + post.comments, 0),
  }));

  const terrainData = stats.flatMap((stat, index) =>
    stat.topPosts.map((post) => ({
      x: Math.cos((index * Math.PI * 2) / stats.length) * 2,
      y: post.engagement / 100,
      z: Math.sin((index * Math.PI * 2) / stats.length) * 2,
      value: post.engagement,
      label: stat.platform,
    }))
  );

  const radialData = stats.map((stat) => ({
    platform: stat.platform,
    engagement: stat.engagementRate,
    followers: stat.followers,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back
          </button>
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Collabrium
          </Link>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-8 mb-8"
        >
          <div className="flex items-start gap-8">
            <img
              src={influencer.avatar || 'https://i.pravatar.cc/150'}
              alt={influencer.name}
              className="w-32 h-32 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{influencer.name}</h1>
              <p className="text-gray-600 mb-4">{influencer.email}</p>
              
              {influencer.location && (
                <p className="text-gray-600 mb-2">
                  📍 {influencer.location.city}, {influencer.location.country}
                </p>
              )}
              
              {influencer.age && (
                <p className="text-gray-600 mb-2">🎂 {influencer.age} years old</p>
              )}
              
              {influencer.genres && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {influencer.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {influencer.pricePerPost && (
                <p className="text-lg font-semibold text-gray-900 mb-4">
                  💰 ${influencer.pricePerPost} per post
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Request Collaboration
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        {stats.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.platform}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {stat.platform} Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Followers:</span>
                    <span className="font-semibold">{stat.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engagement:</span>
                    <span className="font-semibold">{stat.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Influence Score:</span>
                    <span className="font-semibold text-primary-600">
                      {stat.influenceScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-semibold">{stat.confidencePercent}%</span>
                  </div>
                </div>

                {stat.campaignFitTags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Campaign Fit:</p>
                    <div className="flex flex-wrap gap-1">
                      {stat.campaignFitTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {stats.length > 0 && stats[0].aiSummary && (
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl shadow-md p-6 mb-8 text-white">
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p>{stats[0].aiSummary}</p>
          </div>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Engagement Trend</h3>
            <EngagementChart data={chartData} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Platform Comparison</h3>
            <EngagementDistributionChart data={platformStats} />
          </div>
        </div>

        {/* 3D Visualizations */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">3D Engagement Terrain</h3>
            {terrainData.length > 0 ? (
              <InfluenceTerrain data={terrainData} />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">3D Radial Engagement</h3>
            {radialData.length > 0 ? (
              <RadialEngagementChart platforms={radialData} />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-semibold mb-4">Send Message</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'm interested in collaborating with you..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 resize-none"
              rows={5}
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InfluencerProfile;

