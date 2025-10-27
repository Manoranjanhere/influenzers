import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, shortlistAPI } from '../utils/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { User } from '../types';

const BrandDashboard = () => {
  const { user, logout } = useAuth();
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlist, setShortlist] = useState<any[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    location: '',
    ageRange: '',
    genre: '',
    platform: '',
    followerRange: '',
    engagementRate: '',
  });

  useEffect(() => {
    loadInfluencers();
    loadShortlist();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [influencers, filters]);

  const loadInfluencers = async () => {
    try {
      const data = await usersAPI.getInfluencers();
      setInfluencers(data.influencers);
      setFilteredInfluencers(data.influencers);
    } catch (error) {
      console.error('Error loading influencers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadShortlist = async () => {
    try {
      const data = await shortlistAPI.getShortlist();
      setShortlist(data.shortlist);
    } catch (error) {
      console.error('Error loading shortlist:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...influencers];

    if (filters.location) {
      filtered = filtered.filter((inf) => inf.location?.country?.toLowerCase().includes(filters.location.toLowerCase()));
    }

    if (filters.ageRange) {
      const [min, max] = filters.ageRange.split('-').map(Number);
      filtered = filtered.filter((inf) => inf.age >= min && inf.age <= max);
    }

    if (filters.genre) {
      filtered = filtered.filter((inf) => inf.genres?.some((g: string) => g.toLowerCase().includes(filters.genre.toLowerCase())));
    }

    if (filters.platform) {
      filtered = filtered.filter((inf) =>
        inf.stats?.platforms?.some((s: any) => s.platform === filters.platform)
      );
    }

    if (filters.engagementRate) {
      filtered = filtered.filter((inf) => inf.stats?.avgEngagement >= parseFloat(filters.engagementRate));
    }

    setFilteredInfluencers(filtered);
  };

  const addToShortlist = async (influencerId: string) => {
    try {
      await shortlistAPI.addToShortlist(influencerId);
      await loadShortlist();
    } catch (error) {
      console.error('Error adding to shortlist:', error);
    }
  };

  const isInShortlist = (influencerId: string) => {
    return shortlist.some((item) => item.influencerId._id === influencerId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Collabrium</h1>
            <p className="text-sm text-gray-600">{user?.companyName}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {shortlist.length} in shortlist
            </span>
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
        <div className="grid md:grid-cols-4 gap-8">
          {/* Filter Panel */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., United States"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range
                </label>
                <select
                  value={filters.ageRange}
                  onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Any</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre/Niche
                </label>
                <input
                  type="text"
                  value={filters.genre}
                  onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., Fashion, Travel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">All</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Engagement Rate
                </label>
                <input
                  type="number"
                  value={filters.engagementRate}
                  onChange={(e) => setFilters({ ...filters, engagementRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., 3"
                />
              </div>

              <button
                onClick={() => setFilters({ location: '', ageRange: '', genre: '', platform: '', followerRange: '', engagementRate: '' })}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Found {filteredInfluencers.length} Influencers
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredInfluencers.map((inf) => (
                <motion.div
                  key={inf._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={inf.avatar || 'https://i.pravatar.cc/150'}
                      alt={inf.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{inf.name}</h3>
                      <p className="text-sm text-gray-600">{inf.location?.city}, {inf.location?.country}</p>
                      {inf.genres && (
                        <p className="text-xs text-gray-500 mt-1">{inf.genres.join(', ')}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {inf.connectedPlatforms?.instagram?.connected && (
                      <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-semibold">IG</span>
                    )}
                    {inf.connectedPlatforms?.youtube?.connected && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">YT</span>
                    )}
                    {inf.connectedPlatforms?.facebook?.connected && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">FB</span>
                    )}
                  </div>

                  {inf.stats && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Followers:</span>
                        <span className="font-semibold">{inf.stats.totalFollowers?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Engagement:</span>
                        <span className="font-semibold">{inf.stats.avgEngagement?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-semibold text-primary-600">
                          {inf.stats.platforms?.[0]?.influenceScore || 'N/A'}/100
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      to={`/influencer/${inf._id}`}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-center text-sm font-semibold hover:bg-primary-700 transition"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => addToShortlist(inf._id)}
                      disabled={isInShortlist(inf._id)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        isInShortlist(inf._id)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isInShortlist(inf._id) ? '✓' : '⭐'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;

