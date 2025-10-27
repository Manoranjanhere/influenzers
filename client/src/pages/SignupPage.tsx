import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'influencer' | 'brand'>(initialRole as any || 'influencer');
  const [additionalFields, setAdditionalFields] = useState<any>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole as 'influencer' | 'brand');
    }
  }, [initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Clean up empty fields
      const cleanedFields = Object.entries(additionalFields).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          // For location object, clean it too
          if (key === 'location' && typeof value === 'object') {
            const cleanedLocation = Object.entries(value).reduce((locAcc, [locKey, locValue]) => {
              if (locValue !== undefined && locValue !== '' && locValue !== null) {
                locAcc[locKey] = locValue;
              }
              return locAcc;
            }, {} as any);
            
            // Only include location if it has at least one field
            if (Object.keys(cleanedLocation).length > 0) {
              acc[key] = cleanedLocation;
            }
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as any);

      const data = { name, email, password, role, ...cleanedFields };
      console.log('Registration data:', data); // Debug log
      const { token, user } = await authAPI.register(data);
      login(token, user as any);
      navigate(`/dashboard/${user.role}`);
    } catch (err: any) {
      console.error('Registration error:', err.response?.data); // Debug log
      console.error('Full error object:', err); // Full error
      if (err.response?.data?.errors) {
        console.error('Validation errors:', JSON.stringify(err.response.data.errors, null, 2));
      }
      const errorMsg = err.response?.data?.errors?.[0]?.msg 
        || err.response?.data?.message 
        || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary-600 mb-2 block">
            Collabrium
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
          <p className="text-gray-600">Join Collabrium today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('influencer')}
                className={`px-4 py-3 border-2 rounded-lg font-semibold transition ${
                  role === 'influencer'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Influencer
              </button>
              <button
                type="button"
                onClick={() => setRole('brand')}
                className={`px-4 py-3 border-2 rounded-lg font-semibold transition ${
                  role === 'brand'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Brand
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === 'brand' ? 'Company/Brand Name' : 'Full Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={role === 'brand' ? 'Acme Brands Inc' : 'John Doe'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Additional Fields for Influencers */}
          {role === 'influencer' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  value={additionalFields.age || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAdditionalFields({ 
                      ...additionalFields, 
                      age: value ? parseInt(value) : undefined 
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City (Optional)
                </label>
                <input
                  type="text"
                  value={additionalFields.location?.city || ''}
                  onChange={(e) =>
                    setAdditionalFields({ 
                      ...additionalFields, 
                      location: { 
                        ...(additionalFields.location || {}), 
                        city: e.target.value 
                      } 
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country (Optional)
                </label>
                <input
                  type="text"
                  value={additionalFields.location?.country || ''}
                  onChange={(e) =>
                    setAdditionalFields({
                      ...additionalFields,
                      location: { 
                        ...(additionalFields.location || {}), 
                        country: e.target.value 
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="United States"
                />
              </div>
            </>
          )}

          {/* Additional Fields for Brands */}
          {role === 'brand' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={additionalFields.companyName || ''}
                  onChange={(e) => setAdditionalFields({ ...additionalFields, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Acme Brands Inc"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry (Optional)
                </label>
                <select
                  value={additionalFields.industry || ''}
                  onChange={(e) => setAdditionalFields({ ...additionalFields, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Industry</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Tech">Tech</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Travel">Travel</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Fitness">Fitness</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;

