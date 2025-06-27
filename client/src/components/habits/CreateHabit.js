import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../common/Navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Target, 
  BookOpen, 
  Zap, 
  Shield,
  ArrowLeft,
  Star
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5001';

const CreateHabit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    difficulty: 'easy'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/habits', formData);
      toast.success('Quest created successfully! 🎮');
      navigate('/habits');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create quest');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyInfo = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { exp: 10, gold: 5, color: 'green', icon: '⭐' };
      case 'medium':
        return { exp: 20, gold: 10, color: 'yellow', icon: '⭐⭐' };
      case 'hard':
        return { exp: 35, gold: 20, color: 'red', icon: '⭐⭐⭐' };
      default:
        return { exp: 10, gold: 5, color: 'green', icon: '⭐' };
    }
  };

  const difficultyInfo = getDifficultyInfo(formData.difficulty);

  return (
    <div className="min-h-screen bg-adventure-gradient">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="adventure-card p-8"
        >
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/habits')}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors mr-4"
            >
              <ArrowLeft size={20} />
              <span>Back to Quests</span>
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-adventure text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Create New Quest
              </h1>
              <p className="text-gray-600 mt-2">Design your next adventure challenge!</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quest Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quest Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="adventure-input w-full"
                placeholder="e.g., Read for 30 minutes, Exercise daily, Practice piano"
                required
              />
            </motion.div>

            {/* Quest Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quest Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="adventure-input w-full h-24 resize-none"
                placeholder="Describe your quest in detail... What will you accomplish?"
              />
            </motion.div>

            {/* Quest Category */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quest Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="adventure-input w-full"
              >
                <option value="general">General</option>
                <option value="health">Health & Fitness</option>
                <option value="learning">Learning & Education</option>
                <option value="creativity">Creativity & Arts</option>
                <option value="social">Social & Relationships</option>
                <option value="chores">Chores & Responsibilities</option>
                <option value="hobbies">Hobbies & Fun</option>
              </select>
            </motion.div>

            {/* Quest Difficulty */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Quest Difficulty
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['easy', 'medium', 'hard'].map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.difficulty === difficulty
                        ? `border-${difficultyInfo.color}-500 bg-${difficultyInfo.color}-50`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {difficulty === 'easy' && '⭐'}
                        {difficulty === 'medium' && '⭐⭐'}
                        {difficulty === 'hard' && '⭐⭐⭐'}
                      </div>
                      <h3 className="font-semibold text-gray-800 capitalize">{difficulty}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {difficulty === 'easy' && 'Simple tasks'}
                        {difficulty === 'medium' && 'Moderate effort'}
                        {difficulty === 'hard' && 'Challenging goals'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Rewards Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="text-yellow-600 mr-2" size={20} />
                Quest Rewards
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Zap className="text-green-600" size={20} />
                  <div>
                    <p className="font-semibold text-gray-800">{difficultyInfo.exp} Experience Points</p>
                    <p className="text-sm text-gray-600">Level up your character</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="text-yellow-600" size={20} />
                  <div>
                    <p className="font-semibold text-gray-800">{difficultyInfo.gold} Gold Coins</p>
                    <p className="text-sm text-gray-600">Earn currency for rewards</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              type="submit"
              disabled={loading || !formData.name}
              className="adventure-button w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Quest...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Create Quest</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateHabit; 