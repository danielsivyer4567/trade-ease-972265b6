
import React, { createContext, useContext, useState } from 'react';
import { SidebarTheme } from './sidebarTheme';

type SidebarThemeContextType = {
  theme: SidebarTheme;
  setTheme: (theme: SidebarTheme) => void;
};

const SidebarThemeContext = createContext<SidebarThemeContextType | undefined>(undefined);

export const useSidebarTheme = (): SidebarThemeContextType => {
  const context = useContext(SidebarThemeContext);
  if (!context) {
    throw new Error('useSidebarTheme must be used within a SidebarThemeProvider');
  }
  return context;
};

export const SidebarThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: SidebarTheme;
}> = ({ children, defaultTheme = 'default' }) => {
  const [theme, setTheme] = useState<SidebarTheme>(defaultTheme);

  return (
    <SidebarThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </SidebarThemeContext.Provider>
  );
};
