import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usersAPI } from '../utils/api';

const LandingPage = () => {
  const [featuredInfluencers, setFeaturedInfluencers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch featured influencers
    usersAPI.getInfluencers().then((data) => {
      setFeaturedInfluencers(data.influencers.slice(0, 6));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-700">Collabrium</div>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 text-primary-600 hover:text-primary-700">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-20 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Empowering Collaboration Between
          <br />
          <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Brands and Influencers
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Connect, analyze, and collaborate with the most influential creators in your niche.
          Join our platform and discover authentic partnerships.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/signup?role=influencer"
            className="px-8 py-4 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
          >
            Sign in as Influencer
          </Link>
          <Link
            to="/signup?role=brand"
            className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg text-lg font-semibold hover:bg-primary-50 transition"
          >
            Sign in as Brand
          </Link>
        </div>
      </motion.div>

      {/* 3-Step Process */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-3">Connect</h3>
            <p className="text-gray-600">
              Link your social media accounts and sync your analytics in real-time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3">Analyze</h3>
            <p className="text-gray-600">
              Get AI-powered insights and 3D visualizations of your engagement and reach.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-3">Collaborate</h3>
            <p className="text-gray-600">
              Build meaningful partnerships with brands or find the perfect influencers.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Featured Influencers */}
      {featuredInfluencers.length > 0 && (
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Featured Influencers
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredInfluencers.map((inf, index) => (
              <motion.div
                key={inf._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={inf.avatar || 'https://i.pravatar.cc/150'}
                    alt={inf.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{inf.name}</h3>
                    <p className="text-sm text-gray-600">
                      {inf.stats?.totalFollowers?.toLocaleString()} followers
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {inf.genres?.join(', ')}
                </p>
                <p className="text-xs text-gray-500">
                  {inf.location?.city}, {inf.location?.country}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Join now — free for early adopters</h2>
          <p className="text-xl mb-8 opacity-90">
            Get full access for 3 months, no credit card required
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Free Trial
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">Collabrium</div>
          <p className="text-gray-400">
            Empowering Collaboration Between Brands and Influencers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

