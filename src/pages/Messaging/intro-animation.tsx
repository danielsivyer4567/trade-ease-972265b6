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
  // Platform icons and positions
  const platforms = [
    { name: 'facebook', icon: <Facebook className="w-7 h-7 text-blue-600" />, x: -160, y: -120, delay: 0 },
    { name: 'twitter', icon: <Twitter className="w-7 h-7 text-blue-400" />, x: 0, y: -170, delay: 0.1 },
    { name: 'instagram', icon: <Instagram className="w-7 h-7 text-pink-500" />, x: 160, y: -120, delay: 0.2 },
    { name: 'linkedin', icon: <Linkedin className="w-7 h-7 text-blue-600" />, x: 200, y: 0, delay: 0.3 },
    { name: 'tiktok', icon: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>, x: 160, y: 120, delay: 0.4 },
    { name: 'email', icon: <Mail className="w-7 h-7 text-red-500" />, x: -160, y: 120, delay: 0.5 },
    { name: 'sms', icon: <MessageSquare className="w-7 h-7 text-green-500" />, x: -200, y: 0, delay: 0.6 },
    { name: 'whatsapp', icon: <svg className="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, x: 0, y: 170, delay: 0.7 },
    // User icon at bottom
    { name: 'user', icon: <svg className="w-7 h-7 text-blue-800" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>, x: -80, y: 200, delay: 0.8 },
  ];

  // Data packet animations (small dots moving along connections)
  const renderDataPackets = () => {
    return platforms.map((platform, idx) => {
      if (introPhase < 2) return null;
      
      return (
        <React.Fragment key={`packet-${platform.name}`}>
          {/* Incoming packets to center */}
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 z-30"
            style={{
              originX: '50%',
              originY: '50%',
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%'
            }}
            initial={{ 
              x: platform.x * 0.8, 
              y: platform.y * 0.8,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              x: 0, 
              y: 0,
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.2]
            }}
            transition={{
              duration: 1.8,
              delay: platform.delay * 0.5,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
          
          {/* Outgoing packets from center */}
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 z-30"
            style={{
              originX: '50%',
              originY: '50%',
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%'
            }}
            initial={{ 
              x: 0, 
              y: 0,
              opacity: 0,
              scale: 0.2
            }}
            animate={{ 
              x: platform.x * 0.8, 
              y: platform.y * 0.8,
              opacity: [0, 1, 0],
              scale: [0.2, 1, 0.5]
            }}
            transition={{
              duration: 1.8,
              delay: platform.delay * 0.5 + 1.5,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/80">
      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: introPhase >= 0 ? 1 : 0, 
          scale: introPhase >= 1 ? 1 : 0.5 
        }}
        transition={{ duration: 1 }}
        onAnimationComplete={() => {
          if (introPhase === 3) {
            setTimeout(onAnimationComplete, 1500);
          }
        }}
      >
        {/* Center hub image with rings */}
        <motion.div 
          className="w-40 h-40 rounded-full flex items-center justify-center z-20 relative"
          animate={{
            boxShadow: introPhase >= 2 
              ? ['0 0 0 rgba(59, 130, 246, 0)', '0 0 30px rgba(59, 130, 246, 0.8)', '0 0 10px rgba(59, 130, 246, 0.4)']
              : '0 0 0 rgba(59, 130, 246, 0)'
          }}
          transition={{ duration: 1.5, repeat: introPhase === 3 ? Infinity : 0, repeatType: "reverse" }}
        >
          {/* Outer ring - animated */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-400/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: introPhase >= 2 ? [1, 1.15, 1] : 1,
              opacity: introPhase >= 1 ? 1 : 0,
            }}
            transition={{ 
              scale: { duration: 3, repeat: introPhase === 3 ? Infinity : 0 },
              opacity: { duration: 0.5 }
            }}
          />
          
          {/* Inner glowing ring */}
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            animate={{ 
              opacity: introPhase >= 2 ? [0.5, 0.8, 0.5] : 0.3 
            }}
            transition={{ duration: 2, repeat: introPhase === 3 ? Infinity : 0 }}
          />
          
          {/* Hub icon/logo - using the actual image */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 bg-white/90 rounded-full"
              animate={{ 
                opacity: introPhase >= 2 ? [0.7, 1, 0.7] : 0.7 
              }}
              transition={{ duration: 2, repeat: introPhase === 3 ? Infinity : 0 }}
            />
            
            <img 
              src="/images/messaging-hub.svg" 
              alt="Messaging Hub" 
              className="w-full h-full p-2 object-contain z-30 relative"
            />
          </div>
        </motion.div>
        
        {/* Connection lines and platform nodes */}
        <div className="absolute inset-0 pointer-events-none">
          {platforms.map((platform, index) => (
            <React.Fragment key={platform.name}>
              {/* Connection Line */}
              <motion.div
                className={`absolute left-1/2 top-1/2 h-0.5 origin-left
                          ${introPhase >= 2 ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400' : 'bg-gray-600'}`}
                style={{ 
                  width: Math.sqrt(platform.x * platform.x + platform.y * platform.y),
                  transform: `translate(-50%, -50%) rotate(${Math.atan2(platform.y, platform.x)}rad)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: introPhase >= 1 ? 1 : 0,
                  scale: introPhase >= 1 ? 1 : 0
                }}
                transition={{ delay: 0.5 + platform.delay, duration: 0.5 }}
              >
                {/* Animated glow on the connection line */}
                {introPhase >= 2 && (
                  <motion.div 
                    className="absolute inset-0 opacity-60"
                    style={{ 
                      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)',
                      height: '100%',
                      width: '100px'
                    }}
                    animate={{ 
                      left: ['-50px', '100%']
                    }}
                    transition={{ 
                      duration: 2.5, 
                      delay: platform.delay, 
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                )}
              </motion.div>
              
              {/* Platform icon node */}
              <motion.div
                className="absolute left-1/2 top-1/2 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center"
                style={{ 
                  transform: `translate(calc(-50% + ${platform.x}px), calc(-50% + ${platform.y}px))`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: introPhase >= 1 ? 1 : 0,
                  scale: introPhase >= 1 ? 1 : 0,
                  boxShadow: introPhase >= 2 
                    ? ['0 0 0 rgba(59, 130, 246, 0)', '0 0 15px rgba(59, 130, 246, 0.7)', '0 0 5px rgba(59, 130, 246, 0.3)'] 
                    : '0 0 0 rgba(59, 130, 246, 0)'
                }}
                transition={{ 
                  delay: 0.8 + platform.delay, 
                  duration: 0.5,
                  boxShadow: {
                    duration: 2,
                    repeat: introPhase === 3 ? Infinity : 0,
                    repeatType: "reverse"
                  }
                }}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  {platform.icon}
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
        
        {/* Data packets (small dots traveling along connections) */}
        {renderDataPackets()}
        
        {/* Title text */}
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: introPhase >= 1 ? 1 : 0,
            y: introPhase >= 1 ? 0 : 20
          }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Multi-Channel Messaging
          </h1>
          <p className="text-blue-200 mt-1">Connecting all your communication channels in one place</p>
        </motion.div>
      </motion.div>
    </div>
  );
}; 