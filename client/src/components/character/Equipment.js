import React, { useState, useEffect } from 'react';
import Navigation from '../common/Navigation';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Sword, 
  Star,
  Zap,
  Crown,
  Lock,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5001';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('/api/equipment');
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

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

  const getItemIcon = (itemType) => {
    switch (itemType) {
      case 'weapon': return '⚔️';
      case 'armor': return '🛡️';
      case 'accessory': return '💍';
      case 'consumable': return '🧪';
      default: return '📦';
    }
  };

  const getEquipmentByType = () => {
    const grouped = {
      weapon: [],
      armor: [],
      accessory: [],
      consumable: []
    };

    equipment.forEach(item => {
      if (grouped[item.item_type]) {
        grouped[item.item_type].push(item);
      }
    });

    return grouped;
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

  const groupedEquipment = getEquipmentByType();

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
            Equipment Collection
          </h1>
          <p className="text-white/80 text-lg">
            Unlock powerful gear by completing quests and leveling up!
          </p>
        </motion.div>

        {/* Equipment Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="adventure-card p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {equipment.length}
              </div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {equipment.filter(item => item.equipped).length}
              </div>
              <div className="text-sm text-gray-600">Equipped</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {equipment.filter(item => item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary').length}
              </div>
              <div className="text-sm text-gray-600">Rare+ Items</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {equipment.filter(item => item.rarity === 'legendary').length}
              </div>
              <div className="text-sm text-gray-600">Legendary</div>
            </div>
          </div>
        </motion.div>

        {/* Equipment Categories */}
        <div className="space-y-8">
          {Object.entries(groupedEquipment).map(([type, items], typeIndex) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + typeIndex * 0.1 }}
              className="adventure-card p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="text-purple-600 mr-2" size={24} />
                {type.charAt(0).toUpperCase() + type.slice(1)}s
                <span className="ml-2 text-sm text-gray-500">({items.length})</span>
              </h3>

              {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${getRarityBorder(item.rarity)} ${getRarityBackground(item.rarity)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getItemIcon(item.item_type)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.item_name}</h4>
                            <span className={`text-xs font-semibold ${getRarityColor(item.rarity)}`}>
                              {item.rarity.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {item.equipped && (
                          <CheckCircle className="text-green-600" size={20} />
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Unlocked: {new Date(item.unlocked_at).toLocaleDateString()}
                        </span>
                        {!item.equipped && (
                          <button className="text-purple-600 hover:text-purple-700 font-semibold">
                            Equip
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-600">No {type} items unlocked yet.</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete quests and level up to unlock new equipment!
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Equipment Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="adventure-card p-6 mt-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Star className="text-yellow-600 mr-2" size={24} />
            Equipment Guide
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Common</h4>
              <p className="text-sm text-gray-600">Basic equipment unlocked early in your journey</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Uncommon</h4>
              <p className="text-sm text-green-600">Improved gear with better stats</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Rare</h4>
              <p className="text-sm text-blue-600">Powerful equipment with special abilities</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Epic</h4>
              <p className="text-sm text-purple-600">Legendary gear for true champions</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Equipment; 