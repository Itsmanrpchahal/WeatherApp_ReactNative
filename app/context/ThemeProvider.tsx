import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../theme/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { theme, setCurrentTheme, currentTheme } = useThemeStore();

  useEffect(() => {
    const isDark = theme === 'system' 
      ? systemColorScheme === 'dark'
      : theme === 'dark';

    setCurrentTheme(isDark ? darkTheme : lightTheme);
  }, []);

  useEffect(() => {
    const isDark = theme === 'system' 
      ? systemColorScheme === 'dark'
      : theme === 'dark';

    setCurrentTheme(isDark ? darkTheme : lightTheme);
  }, [theme, systemColorScheme]);

  if (!currentTheme) return null;

  return <>{children}</>;
}
