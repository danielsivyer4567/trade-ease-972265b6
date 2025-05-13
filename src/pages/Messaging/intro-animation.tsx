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
      }, 4000); // Show for 4 seconds
      
      return () => clearTimeout(timer);
    }
  }, [introPhase, onAnimationComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Neon messaging hub image as background - positioned behind content */}
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: introPhase >= 1 ? [0, 0.5, 0.5, 0.3] : 0
          }}
          transition={{ 
            duration: 4,
            times: [0, 0.2, 0.8, 1],
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/70 via-purple-600/70 to-pink-600/70 mix-blend-multiply z-20" />
          <img 
            src="/images/messaging/neon-messaging-hub.jpg" 
            alt="Messaging Hub with Social Platform Connections"
            className="w-auto h-auto max-w-[90%] max-h-[90%] object-contain"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}; 