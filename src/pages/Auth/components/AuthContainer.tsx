import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface AuthContainerProps {
  children: React.ReactNode;
}

// Define the background images
const backgroundImages = [
  '/backgrounds/construction.png',
  '/backgrounds/urban.png.png',
  '/backgrounds/acropolis.png.png',
  '/backgrounds/tesla.png.png',
  '/backgrounds/explosion.png.png',
];

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Set up the rotation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative">
      {/* Solid background color to match the image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#f0f0f0',
        }}
      />
      
      {/* Rotating background images with smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 grayscale"
          style={{
            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </AnimatePresence>
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Trade Ease</h1>
          <p className="text-gray-600">Simplifying your business operations</p>
        </div>
        {children}
      </div>
    </div>
  );
};
