import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/theme/ThemeProvider';

export function VolverAgendaButton() {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [styles.button, { backgroundColor: colors.primary }, pressed && styles.buttonPressed]}
      onPress={() => router.navigate('/inicio')}
      hitSlop={8}
    >
      <SymbolView
        name={{
          ios: 'chevron.left',
          android: 'arrow_back',
          web: 'arrow_back',
        }}
        size={18}
        tintColor={colors.background}
        style={styles.icon}
      />
      <Text style={[styles.texto, { color: colors.background }]}>Volver a la agenda</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  icon: {
    width: 18,
    height: 18,
  },
  texto: {
    fontSize: 16,
    fontWeight: '600',
  },
});
