import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';
import type { Turno } from '@/constants/turnos';

type TotalVentasProps = {
  turnos: Turno[];
};

export function TotalVentas({ turnos }: TotalVentasProps) {
  const montoTotal = turnos.reduce((acumulado, turno) => acumulado + turno.monto, 0);
  const turnosCobrados = turnos.length;

  return (
    <View style={styles.card}>
      <View style={styles.filaTitulo}>
        <Text style={styles.titulo}>TOTAL VENTAS</Text>
        <SymbolView
          name={{
            ios: 'banknote',
            android: 'payments',
            web: 'payments',
          }}
          tintColor="#5f6368"
          size={22}
        />
      </View>

      <View style={styles.contenido}>
        <Text style={styles.monto}>${montoTotal.toLocaleString('es-AR')}</Text>
        <Text style={styles.turnosCobrados}>{turnosCobrados} turnos cobrados</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e6e8eb',
    width: '48%',
    aspectRatio: 1.25,
  },
  filaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5f6368',
    letterSpacing: 0.5,
  },
  contenido: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  monto: {
    fontSize: 26,
    fontWeight: '700',
    color: '#202124',
  },
  turnosCobrados: {
    fontSize: 13,
    fontWeight: '500',
    color: '#16a34a',
  },
});
