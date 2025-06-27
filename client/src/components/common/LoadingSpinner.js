import React from 'react';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-adventure-gradient">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-white"
      >
        <Sword size={48} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="ml-4 text-white text-lg font-semibold"
      >
        Loading Adventure...
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 