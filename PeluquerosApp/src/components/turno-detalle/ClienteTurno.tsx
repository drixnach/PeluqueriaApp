import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/theme/ThemeProvider';

type ClienteTurnoProps = {
  clienteId: string;
  nombre: string;
};

export function ClienteTurno({ clienteId, nombre }: ClienteTurnoProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.fila}>
      <View style={[styles.avatar, { backgroundColor: colors.inputBackground }]}>
        <SymbolView
          name={{
            ios: 'person.crop.circle.fill',
            android: 'account_circle',
            web: 'account_circle',
          }}
          size={32}
          tintColor={colors.primaryInactive}
        />
      </View>

      <Text style={[styles.nombre, { color: colors.text }]} numberOfLines={1}>
        {nombre}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.inputBackground, borderColor: colors.border },
          pressed && styles.buttonPressed,
        ]}
        onPress={() =>
          router.push({ pathname: '/cliente-detalle', params: { id: clienteId } })
        }
        hitSlop={8}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>Ver cliente</Text>
        <SymbolView
          name={{
            ios: 'chevron.right',
            android: 'chevron_right',
            web: 'chevron_right',
          }}
          size={16}
          tintColor={colors.primaryInactive}
          style={styles.icon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nombre: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  icon: {
    width: 16,
    height: 16,
  },
});
