import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { ClienteVista } from '@/api/useMisClientes';
import { useTurnosDeCliente, aTurnoVista } from '@/api/useMisTurnos';
import { useTheme } from '@/theme/ThemeProvider';

type UltimosTurnosCardProps = {
  cliente: ClienteVista;
};

export function UltimosTurnosCard({ cliente }: UltimosTurnosCardProps) {
  const { data, isLoading, isError } = useTurnosDeCliente(cliente.id);
  const { colors } = useTheme();

  const turnosCliente = (data ?? [])
    .map(aTurnoVista)
    .sort((a, b) => `${b.fecha} ${b.hora}`.localeCompare(`${a.fecha} ${a.hora}`))
    .slice(0, 3);

  return (
    <View style={[styles.containerCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>Últimos Turnos</Text>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : isError ? (
        <Text style={[styles.vacio, { color: colors.muted }]}>No se pudieron cargar los turnos</Text>
      ) : turnosCliente.length === 0 ? (
        <Text style={[styles.vacio, { color: colors.muted }]}>Todavía no hay turnos</Text>
      ) : (
        turnosCliente.map((turno, index) => (
          <View key={turno.id}>
            <View style={styles.turnoItem}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.servicio, { color: colors.text }]}>{turno.servicio}</Text>
                <View style={styles.infoRow}>
                  <Text style={[styles.fecha, { color: colors.primaryInactive }]}>{formatoFecha(turno.fecha)}</Text>
                  <Text style={[styles.separador, { color: colors.primaryInactive }]}>·</Text>
                  <Text style={[styles.peluquero, { color: colors.primaryInactive }]}>{turno.peluquero}</Text>
                </View>
              </View>
              <Text style={[styles.monto, { color: colors.text }]}>${turno.monto.toLocaleString('es-AR')}</Text>
            </View>
            {index < turnosCliente.length - 1 && <View style={[styles.lineaDivisoria, { backgroundColor: colors.border }]} />}
          </View>
        ))
      )}
    </View>
  );
}

function formatoFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}

const styles = StyleSheet.create({
  containerCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  vacio: {
    fontSize: 14,
  },
  turnoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  lineaDivisoria: {
    height: 1,
    marginHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  servicio: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  fecha: {
    fontSize: 13,
  },
  separador: {
    fontSize: 13,
  },
  peluquero: {
    fontSize: 13,
    fontWeight: '500',
  },
  monto: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
});
