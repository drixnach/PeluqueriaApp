import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/theme/ThemeProvider';

type DetalleButtonProps = {
  clienteId: string;
};

export function DetalleButton({ clienteId }: DetalleButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.inputBackground, borderColor: colors.border },
        pressed && styles.buttonPressed,
      ]}
      onPress={() => router.push({ pathname: '/cliente-detalle', params: { id: clienteId } })}
      hitSlop={8}
    >
      <SymbolView
        name={{
          ios: 'info.circle',
          android: 'info',
          web: 'info',
        }}
        size={18}
        tintColor={colors.primaryInactive}
        style={styles.icon}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  icon: {
    width: 20,
    height: 20,
  },
});