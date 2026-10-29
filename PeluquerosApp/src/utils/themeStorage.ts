import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'peluquerosapp:theme';

export type ThemePreference = 'light' | 'dark' | 'system';

export async function getThemePreference(): Promise<ThemePreference | null> {
  try {
    const value = await AsyncStorage.getItem(THEME_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value;
    }
    return null;
  } catch {
    return null;
  }
}

export async function setThemePreference(theme: ThemePreference): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch {
    
  }
}
