import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../common/Navigation';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Zap, 
  Plus,
  Sword,
  Shield,
  Coins,
  Star
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5001';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentHabits, setRecentHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, habitsRes] = await Promise.all([
        axios.get('/api/stats'),
        axios.get('/api/habits')
      ]);
      
      setStats(statsRes.data);
      setRecentHabits(habitsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateExperienceProgress = () => {
    if (!user) return 0;
    const currentLevelExp = (user.level - 1) * 100;
    const nextLevelExp = user.level * 100;
    const progress = ((user.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getLevelTitle = (level) => {
    if (level < 5) return 'Novice Adventurer';
    if (level < 10) return 'Skilled Warrior';
    if (level < 15) return 'Heroic Champion';
    if (level < 20) return 'Legendary Master';
    return 'Mythical Legend';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-adventure-gradient">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-adventure-gradient">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-adventure text-white mb-2">
            Welcome back, {user?.character_name || 'Adventurer'}!
          </h1>
          <p className="text-white/80 text-lg">
            Continue your epic quest for good habits
          </p>
        </motion.div>

        {/* Character Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="adventure-card p-6 text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Sword className="text-purple-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{user?.level || 1}</h3>
            <p className="text-gray-600 font-semibold">Level</p>
            <p className="text-sm text-purple-600 mt-1">{getLevelTitle(user?.level || 1)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="adventure-card p-6 text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Coins className="text-yellow-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{user?.gold || 100}</h3>
            <p className="text-gray-600 font-semibold">Gold</p>
            <p className="text-sm text-yellow-600 mt-1">Currency earned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="adventure-card p-6 text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Target className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{stats?.total_habits || 0}</h3>
            <p className="text-gray-600 font-semibold">Active Quests</p>
            <p className="text-sm text-green-600 mt-1">Habits created</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="adventure-card p-6 text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Award className="text-blue-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{stats?.total_completions || 0}</h3>
            <p className="text-gray-600 font-semibold">Completed</p>
            <p className="text-sm text-blue-600 mt-1">Quests finished</p>
          </motion.div>
        </div>

        {/* Experience Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="adventure-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Experience Progress</h3>
            <span className="text-sm text-gray-600">
              {user?.experience || 0} / {user?.level * 100 || 100} XP
            </span>
          </div>
          <div className="experience-bar">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${calculateExperienceProgress()}%` }}
              transition={{ duration: 1, delay: 0.6 }}
              className="experience-fill"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {user?.level * 100 - (user?.experience || 0)} XP until next level
          </p>
        </motion.div>

        {/* Quick Actions and Recent Habits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="adventure-card p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Zap className="text-purple-600 mr-2" size={24} />
              Quick Actions
            </h3>
            <div className="space-y-4">
              <Link
                to="/habits/create"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl hover:from-purple-100 hover:to-blue-100 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="text-purple-600" size={20} />
                  <span className="font-semibold text-gray-800">Create New Quest</span>
                </div>
                <span className="text-purple-600">→</span>
              </Link>
              
              <Link
                to="/habits"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <Target className="text-green-600" size={20} />
                  <span className="font-semibold text-gray-800">View All Quests</span>
                </div>
                <span className="text-green-600">→</span>
              </Link>
              
              <Link
                to="/character"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl hover:from-yellow-100 hover:to-orange-100 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="text-yellow-600" size={20} />
                  <span className="font-semibold text-gray-800">Character Profile</span>
                </div>
                <span className="text-yellow-600">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Recent Habits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="adventure-card p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Star className="text-yellow-600 mr-2" size={24} />
              Recent Quests
            </h3>
            {recentHabits.length > 0 ? (
              <div className="space-y-3">
                {recentHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">{habit.name}</h4>
                      <p className="text-sm text-gray-600">{habit.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold difficulty-${habit.difficulty}`}>
                        {habit.difficulty}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        +{habit.experience_reward} XP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-600">No quests yet. Create your first quest to begin your adventure!</p>
                <Link
                  to="/habits/create"
                  className="inline-block mt-4 adventure-button"
                >
                  Create First Quest
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 