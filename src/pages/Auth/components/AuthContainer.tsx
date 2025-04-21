import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

interface AuthContainerProps {
  children: React.ReactNode;
}

// Array of background image filenames - simplified for better performance
const BACKGROUND_IMAGES = [
  'bg1.png',
  'bg2.png',
  'bg3.png',
  'bg4.png',
  'bg5.png'
];

// Function to get a random image from the array
const getRandomBackgroundImage = () => {
  const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
  return BACKGROUND_IMAGES[randomIndex];
};

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  // State to hold the current background image
  const [backgroundImage, setBackgroundImage] = useState<string>(getRandomBackgroundImage());

  // Effect to rotate the background image every 20 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundImage(getRandomBackgroundImage());
    }, 20000); // 20 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
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
      
      {/* Background image with rotation */}
      <div 
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: `url("/backround-images/${backgroundImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          margin: '0',
          padding: '0',
          transition: 'background-image 1s ease-in-out'
        }}
      />
      
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
