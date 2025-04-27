import React, { createContext, useState, useEffect } from 'react';

// Types
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get saved theme from localStorage or default to 'system'
  const savedMode = localStorage.getItem('theme') as ThemeMode | null;
  const [mode, setMode] = useState<ThemeMode>(savedMode || 'system');
  const [isDark, setIsDark] = useState<boolean>(false);

  // Function to determine if the theme should be dark
  const shouldBeDark = (mode: ThemeMode): boolean => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    // If mode is 'system', check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Update isDark state when mode changes
  useEffect(() => {
    setIsDark(shouldBeDark(mode));
    localStorage.setItem('theme', mode);
  }, [mode]);

  // Listen for system theme changes if mode is 'system'
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setIsDark(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Toggle between light and dark mode
  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('light');
    } else {
      // If system, toggle to the opposite of current system preference
      setMode(shouldBeDark(mode) ? 'light' : 'dark');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        isDark,
        setMode,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
