import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface MessagingIntroProps {
  introPhase: number;
  onAnimationComplete: () => void;
}

export const MessagingIntro: React.FC<MessagingIntroProps> = ({ 
  introPhase,
  onAnimationComplete
}) => {
  // Auto-complete animation after set duration
  useEffect(() => {
    if (introPhase >= 1) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 3500); // Show for 3.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [introPhase, onAnimationComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="relative max-w-4xl w-full flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: introPhase >= 1 ? [0, 1, 1, 0] : 0
        }}
        transition={{ 
          duration: 3.5,
          times: [0, 0.2, 0.8, 1],
        }}
      >
        {/* Custom messaging hub image */}
        <img 
          src="/images/Screenshot 2025-04-21 125049.png" 
          alt="Messaging Hub"
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </motion.div>
  );
}; 