
import { useState, useEffect } from 'react';

export const useJobTimer = () => {
  const [jobTimer, setJobTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);

  useEffect(() => {
    let timerInterval: number | null = null;
    
    if (isTimerRunning) {
      timerInterval = window.setInterval(() => {
        setJobTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
      }
    };
  }, [isTimerRunning]);

  const handleBreakToggle = () => {
    setIsOnBreak(!isOnBreak);
  };

  return {
    jobTimer,
    isTimerRunning,
    isOnBreak,
    setIsTimerRunning,
    handleBreakToggle
  };
};
