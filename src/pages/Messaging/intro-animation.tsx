import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface MessagingIntroProps {
  introPhase: number;
  onAnimationComplete: () => void;
}

export const MessagingIntro: React.FC<MessagingIntroProps> = ({ 
  introPhase,
  onAnimationComplete
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/80">
      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ 
          opacity: introPhase >= 0 ? 1 : 0, 
          scale: introPhase >= 1 ? 1 : 0.7 
        }}
        transition={{ duration: 1 }}
        onAnimationComplete={() => {
          if (introPhase === 3) {
            setTimeout(onAnimationComplete, 1500);
          }
        }}
      >
        {/* Main image container */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{ width: '700px', height: '700px' }}
        >
          {/* Title text */}
          <motion.div
            className="absolute top-0 left-0 w-full text-center mt-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: introPhase >= 1 ? 1 : 0,
              y: introPhase >= 1 ? 0 : -20
            }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Multi messaging platform
            </h1>
            <div className="w-full h-1 bg-white/80 mt-2"></div>
          </motion.div>

          {/* Platform connection image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: introPhase >= 1 ? 1 : 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <img 
              src="/images/messaging-hub.svg" 
              alt="Multi Messaging Platform"
              className="w-[650px] h-auto"
            />
            
            {/* Animated overlay for glow effect */}
            {introPhase >= 2 && (
              <>
                {/* Central hub glow */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white/30 blur-xl z-10"
                  style={{ transform: 'translate(-50%, -50%)' }}
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Data packet animations */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => {
                  // Calculate angles for different directions (45 degrees apart)
                  const angle = (idx * 45) * (Math.PI / 180);
                  const radius = 250; // Distance from center
                  
                  // Calculate position based on angle
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <React.Fragment key={`packet-${idx}`}>
                      {/* Incoming packet */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-blue-500/80 shadow-lg shadow-blue-500/50 z-20"
                        style={{ translateX: '-50%', translateY: '-50%' }}
                        animate={{
                          x: [x, 0],
                          y: [y, 0],
                          opacity: [0, 1, 0],
                          scale: [0.5, 1.2, 0.2]
                        }}
                        transition={{
                          duration: 2.5,
                          delay: idx * 0.2 + 0.5,
                          repeat: Infinity,
                          repeatDelay: 5
                        }}
                      />
                      
                      {/* Outgoing packet */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-purple-500/80 shadow-lg shadow-purple-500/50 z-20"
                        style={{ translateX: '-50%', translateY: '-50%' }}
                        animate={{
                          x: [0, x],
                          y: [0, y],
                          opacity: [0, 1, 0],
                          scale: [0.2, 1.2, 0.5]
                        }}
                        transition={{
                          duration: 2.5,
                          delay: idx * 0.2 + 2.0,
                          repeat: Infinity,
                          repeatDelay: 5
                        }}
                      />
                      
                      {/* Connection line glow */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 h-1 origin-left bg-gradient-to-r from-blue-500 via-white to-blue-500/0 z-10"
                        style={{ 
                          width: radius,
                          transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 0.7, 0]
                        }}
                        transition={{
                          duration: 2,
                          delay: idx * 0.15 + 0.3,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}; 