import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Home, 
  List, 
  Plus, 
  User, 
  Shield, 
  Trophy, 
  LogOut,
  Sword,
  Coins
} from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/habits', icon: List, label: 'Quests' },
    { path: '/habits/create', icon: Plus, label: 'New Quest' },
    { path: '/character', icon: User, label: 'Character' },
    { path: '/equipment', icon: Shield, label: 'Equipment' },
    { path: '/achievements', icon: Trophy, label: 'Achievements' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Sword className="text-purple-600" size={32} />
              <span className="text-2xl font-adventure text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Habit Adventure
              </span>
            </Link>
          </motion.div>

          {/* Character Stats */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-purple-800">Level</span>
              <span className="level-badge">{user?.level || 1}</span>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Coins className="text-yellow-600" size={16} />
              <span className="text-sm font-semibold text-yellow-800">{user?.gold || 100}</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-blue-800">{user?.character_name || 'Adventurer'}</span>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
          >
            <LogOut size={20} />
            <span className="hidden md:block font-medium">Logout</span>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <span className="level-badge">Level {user?.level || 1}</span>
              <div className="flex items-center space-x-1">
                <Coins className="text-yellow-600" size={16} />
                <span className="text-sm font-semibold text-yellow-800">{user?.gold || 100}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-around py-2 border-t border-gray-200">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 