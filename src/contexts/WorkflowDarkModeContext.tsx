import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define color constants for dark mode
export const DARK_BG = '#0e0e20';        // dark blue/purple background
export const DARK_SECONDARY = '#171939'; // slightly lighter blue/purple for secondary elements
export const DARK_TEXT = '#f8f8f8';      // off-white text
export const DARK_GOLD = '#a595ff';      // light purple accent (instead of light gray)

// Define the shape of the context value
interface WorkflowDarkModeContextType {
  darkMode: boolean;
  isDarkModeLocked: boolean;
}

// Create the context with a default value
const WorkflowDarkModeContext = createContext<WorkflowDarkModeContextType>({
  darkMode: true,
  isDarkModeLocked: true
});

// Define the provider props
interface WorkflowDarkModeProviderProps {
  children: ReactNode;
}

// Create a provider component
export function WorkflowDarkModeProvider({ children }: WorkflowDarkModeProviderProps) {
  // Dark mode is always on
  const [darkMode] = useState(true);
  const [isDarkModeLocked] = useState(true);
  
  const value = {
    darkMode,
    isDarkModeLocked
  };

  return (
    <WorkflowDarkModeContext.Provider value={value}>
      {children}
    </WorkflowDarkModeContext.Provider>
  );
}

// Create a custom hook for accessing the context
export function useWorkflowDarkMode() {
  return useContext(WorkflowDarkModeContext);
} 