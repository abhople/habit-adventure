import React, { useState, useEffect } from 'react';
import Navigation from '../common/Navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Sword, 
  Shield, 
  Coins, 
  Zap,
  Star,
  Award,
  TrendingUp,
  Crown,
  Target
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5001';

const Character = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load character stats');
    } finally {
      setLoading(false);
    }
  };

  const getLevelTitle = (level) => {
    if (level < 5) return { title: 'Novice Adventurer', color: 'text-green-600' };
    if (level < 10) return { title: 'Skilled Warrior', color: 'text-blue-600' };
    if (level < 15) return { title: 'Heroic Champion', color: 'text-purple-600' };
    if (level < 20) return { title: 'Legendary Master', color: 'text-orange-600' };
    return { title: 'Mythical Legend', color: 'text-red-600' };
  };

  const getNextLevelProgress = () => {
    // This would need to be calculated based on current user data
    return 75; // Placeholder
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
        {/* Character Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-adventure text-white mb-2">
            Character Profile
          </h1>
          <p className="text-white/80 text-lg">
            Your adventure journey and achievements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="adventure-card p-6 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="text-white" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Character Name
                </h2>
                <p className="text-gray-600">Adventurer</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Sword className="text-purple-600" size={20} />
                    <span className="font-semibold text-gray-800">Level</span>
                  </div>
                  <span className="level-badge">1</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Coins className="text-yellow-600" size={20} />
                    <span className="font-semibold text-gray-800">Gold</span>
                  </div>
                  <span className="gold-badge">100</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="text-green-600" size={20} />
                    <span className="font-semibold text-gray-800">Experience</span>
                  </div>
                  <span className="text-green-600 font-bold">0 XP</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats and Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Level Progress */}
            <div className="adventure-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <TrendingUp className="text-purple-600 mr-2" size={24} />
                  Level Progress
                </h3>
                <span className="text-sm text-gray-600">75 / 100 XP</span>
              </div>
              
              <div className="experience-bar mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getNextLevelProgress()}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="experience-fill"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Level 1</span>
                <span>25 XP to Level 2</span>
                <span>Level 2</span>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="adventure-card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Award className="text-yellow-600 mr-2" size={24} />
                Achievement Stats
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {stats?.total_habits || 0}
                  </div>
                  <div className="text-sm text-gray-600">Quests Created</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {stats?.total_completions || 0}
                  </div>
                  <div className="text-sm text-gray-600">Quests Completed</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {stats?.total_experience || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total XP Earned</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {stats?.total_gold || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Gold Earned</div>
                </div>
              </div>
            </div>

            {/* Level Titles */}
            <div className="adventure-card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Crown className="text-yellow-600 mr-2" size={24} />
                Level Titles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { level: 1, title: 'Novice Adventurer', unlocked: true },
                  { level: 5, title: 'Skilled Warrior', unlocked: false },
                  { level: 10, title: 'Heroic Champion', unlocked: false },
                  { level: 15, title: 'Legendary Master', unlocked: false },
                  { level: 20, title: 'Mythical Legend', unlocked: false }
                ].map((title) => (
                  <div
                    key={title.level}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      title.unlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">
                          Level {title.level}
                        </div>
                        <div className={`text-sm ${title.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                          {title.title}
                        </div>
                      </div>
                      <div className="text-2xl">
                        {title.unlocked ? '✅' : '🔒'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Character; 