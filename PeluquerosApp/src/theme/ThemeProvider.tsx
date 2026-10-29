import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { darkColors, lightColors, type ThemeColors } from './colors';
import { getThemePreference, setThemePreference, type ThemePreference } from '@/utils/themeStorage';

type ThemeContextType = {
  colors: ThemeColors;
  isDark: boolean;
  colorScheme: 'light' | 'dark' | 'unspecified';
  themePreference: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getThemePreference();
      if (saved) {
        setThemePreferenceState(saved);
        Appearance.setColorScheme(saved === 'system' ? 'unspecified' : saved);
      }
      setLoaded(true);
    })();
  }, []);

  const colorScheme = themePreference === 'system' ? systemColorScheme : themePreference;
  const isDark = colorScheme === 'dark';

  const value = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      colorScheme,
      themePreference,
      setTheme: (theme: ThemePreference) => {
        setThemePreferenceState(theme);
        Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme);
        void setThemePreference(theme);
      },
      toggleTheme: () => {
        const next: ThemePreference = isDark ? 'light' : 'dark';
        setThemePreferenceState(next);
        Appearance.setColorScheme(next);
        void setThemePreference(next);
      },
    }),
    [isDark, colorScheme, themePreference]
  );

  if (!loaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

