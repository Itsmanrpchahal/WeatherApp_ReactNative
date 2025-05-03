import { useThemeStore } from "@/app/context/ThemeContext";

export function useAppTheme() {
  const { currentTheme } = useThemeStore();

  if (!currentTheme) {
    throw new Error('Theme not initialized. Make sure to use useAppTheme within ThemeProvider');
  }

  return {
    colors: currentTheme.colors,
    isDark: currentTheme.dark,
  };
}