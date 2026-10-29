import { StyleSheet, Text, View } from 'react-native';
import type { TurnoVista } from '@/api/useMisTurnos';
import { tituloDia } from '@/utils/fechas';
import { useTheme } from '@/theme/ThemeProvider';


type DetalleTurnoProps = {
  turno: TurnoVista;
};

function parseFecha(fecha: string): Date {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

function formatoMonto(monto: number): string {
  return `$${monto.toLocaleString('es-AR')}`;
}

export function DetalleTurno({ turno }: DetalleTurnoProps) {
  const { colors } = useTheme();
  const dia = tituloDia(parseFecha(turno.fecha));

  return (
    <View style={styles.container}>
      <Text style={[styles.fecha, { color: colors.primaryInactive }]}>
        {dia} a las {turno.hora}
      </Text>

      <View style={styles.fila}>
        <Text style={[styles.label, { color: colors.primaryInactive }]}>Servicio</Text>
        <View style={styles.valorServicio}>
          <Text style={[styles.servicio, { color: colors.text }]}>{turno.servicio}</Text>
          <Text style={[styles.precio, { color: colors.text }]}>{formatoMonto(turno.monto)}</Text>
        </View>
      </View>

      <View style={styles.fila}>
        <Text style={[styles.label, { color: colors.primaryInactive }]}>Peluquero</Text>
        <Text style={[styles.valor, { color: colors.text }]}>{turno.peluquero}</Text>
      </View>

      <View style={[styles.divisor, { backgroundColor: colors.border }]} />

      <View style={styles.filaTotal}>
        <Text style={[styles.labelTotal, { color: colors.text }]}>Total a pagar</Text>
        <Text style={styles.total}>{formatoMonto(turno.monto)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    gap: 12,
  },
  fecha: {
    fontSize: 14,
    fontWeight: '600',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  valorServicio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  label: {
    fontSize: 13,
  },
  valor: {
    fontSize: 14,
    fontWeight: '600',
  },
  servicio: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  precio: {
    fontSize: 14,
    fontWeight: '600',
  },
  divisor: {
    height: 1,
  },
  filaTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelTotal: {
    fontSize: 15,
    fontWeight: '600',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
  },
});
