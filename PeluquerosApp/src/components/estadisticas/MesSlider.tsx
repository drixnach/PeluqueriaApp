import { Pressable, StyleSheet, Text, View } from 'react-native';

type MesSliderProps = {
  mes: Date;
  onCambiarMes: (desplazamiento: number) => void;
};

export function MesSlider({ mes, onCambiarMes }: MesSliderProps) {
  const mesFormateado = new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  }).format(mes);
  const titulo = mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mes anterior"
        onPress={() => onCambiarMes(-1)}
        style={styles.boton}
      >
        <Text style={styles.flecha}>‹</Text>
      </Pressable>
      <Text style={styles.mes} accessibilityRole="header">
        {titulo}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mes siguiente"
        onPress={() => onCambiarMes(1)}
        style={styles.boton}
      >
        <Text style={styles.flecha}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d7d9f0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#333c87',
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
    color: '#1a1f4d',
    fontSize: 34,
    lineHeight: 40,
  },
  mes: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1f4d',
  },
});
