import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the dark mode colors once to use across components
export const DARK_GOLD = '#bfa14a';
export const DARK_BG = '#18140c';
export const DARK_TEXT = '#ffe082';
export const DARK_SECONDARY = '#211c15';

// Create the context with a default value
type WorkflowDarkModeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
};

const WorkflowDarkModeContext = createContext<WorkflowDarkModeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

// Create a provider component
export const WorkflowDarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get dark mode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('workflowDarkMode');
    return saved === 'true';
  });

  // Update localStorage when darkMode changes
  useEffect(() => {
    localStorage.setItem('workflowDarkMode', darkMode.toString());
    console.log('WorkflowDarkMode set to:', darkMode);
  }, [darkMode]);

  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <WorkflowDarkModeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </WorkflowDarkModeContext.Provider>
  );
};

// Custom hook to use the context
export const useWorkflowDarkMode = () => useContext(WorkflowDarkModeContext); 