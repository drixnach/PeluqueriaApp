import { Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/theme/ThemeProvider';

export default function ModoOscuroButton() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <SymbolView
        name={{ ios: isDark ? 'sun.max.fill' : 'moon.fill', android: isDark ? 'light_mode' : 'dark_mode', web: isDark ? 'light_mode' : 'dark_mode' }}
        tintColor={colors.text}
        size={22}
      />
    </Pressable>
  );
}

