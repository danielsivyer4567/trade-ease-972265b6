
import { useState, useEffect } from 'react';

export const useNotificationLayout = () => {
  const [isFullWidth, setIsFullWidth] = useState(() => {
    // Initialize from localStorage, default to false if not set
    const saved = localStorage.getItem("notifications-full-width");
    return saved ? JSON.parse(saved) : false;
  });

  const [isButtonPressed, setIsButtonPressed] = useState(false);
  
  const handleLayoutToggle = () => {
    setIsButtonPressed(true);
    setIsFullWidth(!isFullWidth);
    setTimeout(() => setIsButtonPressed(false), 200);
  };
  
  // Save layout preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("notifications-full-width", JSON.stringify(isFullWidth));
  }, [isFullWidth]);

  return {
    isFullWidth,
    isButtonPressed,
    handleLayoutToggle
  };
};
