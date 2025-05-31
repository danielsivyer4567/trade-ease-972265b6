import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the dark mode colors once to use across components
export const DARK_GOLD = '#a0a0a0';
export const DARK_BG = '#2b2b2b';
export const DARK_TEXT = '#f8f8f8';
export const DARK_SECONDARY = '#333333';

// Create the context with a default value
type WorkflowDarkModeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  isDarkModeLocked: boolean;
  toggleDarkModeLock: () => void;
};

const WorkflowDarkModeContext = createContext<WorkflowDarkModeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
  isDarkModeLocked: false,
  toggleDarkModeLock: () => {},
});

// Create a provider component
export const WorkflowDarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get dark mode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('workflowDarkMode');
    return saved === 'true';
  });

  // Get dark mode lock state from localStorage
  const [isDarkModeLocked, setIsDarkModeLocked] = useState(() => {
    const savedLock = localStorage.getItem('workflowDarkModeLocked');
    return savedLock === 'true';
  });

  // Update localStorage when darkMode changes
  useEffect(() => {
    localStorage.setItem('workflowDarkMode', darkMode.toString());
    console.log('WorkflowDarkMode set to:', darkMode);
    
    // If dark mode is locked, make sure it stays on
    if (isDarkModeLocked && !darkMode) {
      setDarkMode(true);
    }
  }, [darkMode, isDarkModeLocked]);

  // Update localStorage when lock state changes
  useEffect(() => {
    localStorage.setItem('workflowDarkModeLocked', isDarkModeLocked.toString());
    console.log('WorkflowDarkMode lock set to:', isDarkModeLocked);
    
    // If we're locking dark mode, ensure dark mode is enabled
    if (isDarkModeLocked) {
      setDarkMode(true);
    }
  }, [isDarkModeLocked]);

  // Toggle function
  const toggleDarkMode = () => {
    // Only allow turning off dark mode if it's not locked
    if (isDarkModeLocked && darkMode) {
      console.log('Dark mode is locked and cannot be disabled');
      return;
    }
    setDarkMode(prev => !prev);
  };

  // Toggle lock function
  const toggleDarkModeLock = () => {
    setIsDarkModeLocked(prev => !prev);
  };

  return (
    <WorkflowDarkModeContext.Provider 
      value={{ 
        darkMode, 
        setDarkMode, 
        toggleDarkMode,
        isDarkModeLocked,
        toggleDarkModeLock
      }}
    >
      {children}
    </WorkflowDarkModeContext.Provider>
  );
};

// Custom hook to use the context
export function useWorkflowDarkMode() {
  return useContext(WorkflowDarkModeContext);
} 