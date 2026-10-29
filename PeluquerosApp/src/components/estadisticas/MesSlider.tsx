import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type MesSliderProps = {
  mes: Date;
  onCambiarMes: (desplazamiento: number) => void;
};

export function MesSlider({ mes, onCambiarMes }: MesSliderProps) {
  const { colors } = useTheme();
  const mesFormateado = new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  }).format(mes);
  const titulo = mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mes anterior"
        onPress={() => onCambiarMes(-1)}
        style={styles.boton}
      >
        <Text style={[styles.flecha, { color: colors.text }]}>‹</Text>
      </Pressable>
      <Text style={[styles.mes, { color: colors.text }]} accessibilityRole="header">
        {titulo}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mes siguiente"
        onPress={() => onCambiarMes(1)}
        style={styles.boton}
      >
        <Text style={[styles.flecha, { color: colors.text }]}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },
  boton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flecha: {
    fontSize: 34,
    lineHeight: 40,
  },
  mes: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
});
