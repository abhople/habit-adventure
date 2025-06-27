import React, { useState, useEffect } from 'react';
import Navigation from '../common/Navigation';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star,
  Award,
  Target,
  Zap,
  Crown,
  Lock,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5001';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get('/api/achievements');
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  // Mock achievements data since we haven't implemented achievement system yet
  const mockAchievements = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first quest',
      unlocked: true,
      unlocked_at: new Date().toISOString(),
      icon: '🎯',
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Quest Master',
      description: 'Complete 10 quests',
      unlocked: false,
      icon: '⭐',
      rarity: 'uncommon'
    },
    {
      id: '3',
      name: 'Level Up!',
      description: 'Reach level 5',
      unlocked: false,
      icon: '📈',
      rarity: 'uncommon'
    },
    {
      id: '4',
      name: 'Gold Collector',
      description: 'Earn 500 gold coins',
      unlocked: false,
      icon: '💰',
      rarity: 'rare'
    },
    {
      id: '5',
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      unlocked: false,
      icon: '🔥',
      rarity: 'rare'
    },
    {
      id: '6',
      name: 'Legendary Hero',
      description: 'Reach level 20',
      unlocked: false,
      icon: '👑',
      rarity: 'epic'
    },
    {
      id: '7',
      name: 'Perfect Week',
      description: 'Complete all daily quests for 7 days',
      unlocked: false,
      icon: '🌟',
      rarity: 'epic'
    },
    {
      id: '8',
      name: 'Mythical Legend',
      description: 'Unlock all achievements',
      unlocked: false,
      icon: '🏆',
      rarity: 'legendary'
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-200';
      case 'uncommon': return 'border-green-200';
      case 'rare': return 'border-blue-200';
      case 'epic': return 'border-purple-200';
      case 'legendary': return 'border-orange-200';
      default: return 'border-gray-200';
    }
  };

  const getRarityBackground = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50';
      case 'uncommon': return 'bg-green-50';
      case 'rare': return 'bg-blue-50';
      case 'epic': return 'bg-purple-50';
      case 'legendary': return 'bg-orange-50';
      default: return 'bg-gray-50';
    }
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

  const unlockedCount = mockAchievements.filter(a => a.unlocked).length;
  const totalCount = mockAchievements.length;

  return (
    <div className="min-h-screen bg-adventure-gradient">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-adventure text-white mb-2">
            Achievements
          </h1>
          <p className="text-white/80 text-lg">
            Unlock achievements by completing challenges and reaching milestones!
          </p>
        </motion.div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="adventure-card p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {unlockedCount}
              </div>
              <div className="text-sm text-gray-600">Unlocked</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {totalCount}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round((unlockedCount / totalCount) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {mockAchievements.filter(a => a.rarity === 'legendary' && a.unlocked).length}
              </div>
              <div className="text-sm text-gray-600">Legendary</div>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="adventure-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Trophy className="text-yellow-600 mr-2" size={24} />
              Achievement Progress
            </h3>
            <span className="text-sm text-gray-600">
              {unlockedCount} / {totalCount} Achievements
            </span>
          </div>
          
          <div className="experience-bar">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="experience-fill"
            />
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mockAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`adventure-card p-6 transition-all duration-300 ${
                achievement.unlocked 
                  ? 'hover:shadow-2xl transform hover:-translate-y-1' 
                  : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                    <span className={`text-xs font-semibold ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-2xl">
                  {achievement.unlocked ? (
                    <CheckCircle className="text-green-600" size={24} />
                  ) : (
                    <Lock className="text-gray-400" size={24} />
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>

              {achievement.unlocked && (
                <div className="text-xs text-gray-500">
                  Unlocked: {new Date(achievement.unlocked_at).toLocaleDateString()}
                </div>
              )}

              {!achievement.unlocked && (
                <div className="text-xs text-gray-500">
                  Keep completing quests to unlock this achievement!
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="adventure-card p-6 mt-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Star className="text-yellow-600 mr-2" size={24} />
            Achievement Guide
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Common</h4>
              <p className="text-sm text-gray-600">Basic achievements for getting started</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Uncommon</h4>
              <p className="text-sm text-green-600">Milestone achievements for dedicated adventurers</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Rare</h4>
              <p className="text-sm text-blue-600">Challenging achievements for skilled players</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Epic</h4>
              <p className="text-sm text-purple-600">Legendary achievements for true champions</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Achievements; 