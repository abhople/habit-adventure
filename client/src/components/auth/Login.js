import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      toast.success('Welcome back, brave adventurer! 🗡️');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-20 left-10 text-purple-300"
          >
            <Sword size={24} />
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-32 right-10 text-blue-300"
          >
            <Shield size={24} />
          </motion.div>
          <motion.div
            animate={{ y: [-5, 15, -5] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute bottom-32 left-20 text-yellow-300"
          >
            <Zap size={24} />
          </motion.div>
          <motion.div
            animate={{ y: [15, -5, 15] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-20 right-20 text-pink-300"
          >
            <Sparkles size={24} />
          </motion.div>
        </div>

        {/* Login Card */}
        <div className="adventure-card p-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-adventure text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
              Habit Adventure
            </h1>
            <p className="text-gray-600 mb-8">Begin your epic quest for good habits!</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="adventure-input w-full"
                placeholder="Enter your username"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="adventure-input w-full"
                placeholder="Enter your password"
                required
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              type="submit"
              disabled={loading}
              className="adventure-button w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <Sword size={20} />
                  <span>Begin Adventure</span>
                </>
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Create your character
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 