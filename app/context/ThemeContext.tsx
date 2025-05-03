import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppTheme, CustomTheme, darkTheme, lightTheme } from '../theme/theme';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  currentTheme: CustomTheme;
  setCurrentTheme: (theme: CustomTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  currentTheme: lightTheme,
  setCurrentTheme: () => {}, 
});

const THEME_KEY = 'theme-storage';

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>('system');
  const [currentTheme, setCurrentThemeState] = useState<CustomTheme>(lightTheme);

  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (storedTheme) {
        setThemeState(storedTheme as AppTheme);
      }
    })();
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      setCurrentThemeState(lightTheme);
    } else if (theme === 'dark') {
      setCurrentThemeState(darkTheme);
    } else {
      const systemTheme = getSystemTheme(); 
      setCurrentThemeState(systemTheme);
    }
  }, [theme]);

  const setTheme = async (newTheme: AppTheme) => {
    setThemeState(newTheme);
    console.log('Setting theme to:', newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme);
  };

  const getSystemTheme = (): CustomTheme => {
    const systemPreferredTheme = 'light'; 
    return systemPreferredTheme === 'light' ? lightTheme : darkTheme;
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme, setCurrentTheme: setCurrentThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeStore = () => useContext(ThemeContext);
