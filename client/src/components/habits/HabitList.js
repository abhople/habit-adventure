import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../common/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Target, 
  CheckCircle, 
  Clock, 
  Zap,
  Coins,
  Star,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5001';

const HabitList = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [completingHabit, setCompletingHabit] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get('/api/habits');
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    setCompletingHabit(habitId);
    
    try {
      const response = await axios.post(`/api/habits/${habitId}/complete`);
      const { experience_gained, gold_gained, new_streak, level_up, equipment_unlocked } = response.data;
      
      // Update habits list
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === habitId 
            ? { ...habit, streak: new_streak }
            : habit
        )
      );

      // Show success message
      let message = `Quest completed! +${experience_gained} XP, +${gold_gained} Gold`;
      if (level_up) {
        message += ` 🎉 LEVEL UP!`;
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      if (equipment_unlocked.length > 0) {
        message += ` 🗡️ New equipment unlocked!`;
      }
      
      toast.success(message);
      
      // Refresh user data (you might want to update the auth context here)
      
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete quest');
    } finally {
      setCompletingHabit(null);
    }
  };

  const filteredHabits = habits.filter(habit => {
    const matchesFilter = filter === 'all' || habit.category === filter;
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'health': return '💪';
      case 'learning': return '📚';
      case 'creativity': return '🎨';
      case 'social': return '👥';
      case 'chores': return '🏠';
      case 'hobbies': return '🎮';
      default: return '⭐';
    }
  };

  const getDifficultyStars = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      default: return '⭐';
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

  return (
    <div className="min-h-screen bg-adventure-gradient">
      <Navigation />
      {showConfetti && <Confetti />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-adventure text-white mb-2">
            Your Quests
          </h1>
          <p className="text-white/80 text-lg">
            Complete quests to level up and earn rewards!
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="adventure-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search quests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="adventure-input w-full pl-10"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-600" size={20} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="adventure-input"
                >
                  <option value="all">All Categories</option>
                  <option value="general">General</option>
                  <option value="health">Health & Fitness</option>
                  <option value="learning">Learning & Education</option>
                  <option value="creativity">Creativity & Arts</option>
                  <option value="social">Social & Relationships</option>
                  <option value="chores">Chores & Responsibilities</option>
                  <option value="hobbies">Hobbies & Fun</option>
                </select>
              </div>

              <Link
                to="/habits/create"
                className="adventure-button flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>New Quest</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Habits Grid */}
        {filteredHabits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="habit-card"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getCategoryIcon(habit.category)}</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{habit.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold difficulty-${habit.difficulty}`}>
                          {getDifficultyStars(habit.difficulty)} {habit.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {habit.description && (
                    <p className="text-gray-600 text-sm mb-4">{habit.description}</p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Zap className="text-green-600" size={16} />
                        <span className="text-gray-700">+{habit.experience_reward} XP</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Coins className="text-yellow-600" size={16} />
                        <span className="text-gray-700">+{habit.gold_reward} Gold</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="text-blue-600" size={16} />
                      <span className="text-sm text-gray-600">Streak: {habit.streak}</span>
                    </div>
                  </div>

                  {/* Complete Button */}
                  <button
                    onClick={() => handleCompleteHabit(habit.id)}
                    disabled={completingHabit === habit.id}
                    className="w-full adventure-button flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {completingHabit === habit.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Completing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        <span>Complete Quest</span>
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="adventure-card p-12 text-center"
          >
            <Target className="text-gray-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Quests Found</h3>
            <p className="text-gray-600 mb-6">
              {habits.length === 0 
                ? "You haven't created any quests yet. Start your adventure by creating your first quest!"
                : "No quests match your current filters. Try adjusting your search or filters."
              }
            </p>
            {habits.length === 0 && (
              <Link
                to="/habits/create"
                className="adventure-button inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Create Your First Quest</span>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HabitList; 