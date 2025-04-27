import React, { createContext, useState, useEffect } from 'react';

// Types
interface Settings {
  language: string;
  notificationsEnabled: boolean;
  defaultSearchRadius: number;
  defaultPageSize: number;
  autoRefreshInterval: number; // in minutes, 0 means disabled
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: Settings = {
  language: 'de',
  notificationsEnabled: true,
  defaultSearchRadius: 25, // km
  defaultPageSize: 10,
  autoRefreshInterval: 5, // minutes
};

// Context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider
interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Initialize settings from localStorage or use defaults
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
