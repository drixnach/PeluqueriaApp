import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';
import type { TurnoVista } from '@/api/useMisTurnos';
import { useTheme } from '@/theme/ThemeProvider';

type TotalVentasProps = {
  turnos: TurnoVista[];
};

export function TotalVentas({ turnos }: TotalVentasProps) {
  const { colors } = useTheme();
  const montoTotal = turnos.reduce((acumulado, turno) => acumulado + turno.monto, 0);
  const turnosCobrados = turnos.length;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary }]}>
      <View style={styles.filaTitulo}>
        <Text style={[styles.titulo, { color: colors.primaryInactive }]}>TOTAL VENTAS</Text>
        <SymbolView
          name={{
            ios: 'banknote',
            android: 'payments',
            web: 'payments',
          }}
          tintColor={colors.primaryInactive}
          size={22}
        />
      </View>

      <View style={styles.contenido}>
        <Text style={[styles.monto, { color: colors.text }]}>${montoTotal.toLocaleString('es-AR')}</Text>
        <Text style={styles.turnosCobrados}>{turnosCobrados} turnos cobrados</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
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
  },
  turnosCobrados: {
    fontSize: 13,
    fontWeight: '500',
    color: '#16a34a',
  },
});
