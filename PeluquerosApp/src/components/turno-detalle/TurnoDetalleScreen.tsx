import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMiTurno, aTurnoVista } from '@/api/useMisTurnos';
import { ClienteTurno } from '@/components/turno-detalle/ClienteTurno';
import { DetalleTurno } from '@/components/turno-detalle/DetalleTurno';
import { VolverAgendaButton } from '@/components/turno-detalle/VolverAgendaButton';
import { useTheme } from '@/theme/ThemeProvider';

export function TurnoDetalleScreen() {
  const { id } = useLocalSearchParams();
  const turnoId = Array.isArray(id) ? id[0] : id;
  const { colors } = useTheme();

  const { data, isLoading, isError, error, refetch } = useMiTurno(turnoId);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.primaryInactive }]}>{error?.message ?? 'Error al cargar el turno'}</Text>
        <Pressable onPress={() => refetch()} hitSlop={8}>
          <Text style={[styles.reintentar, { color: colors.primary }]}>Tocá para reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.primaryInactive }]}>Turno no encontrado</Text>
      </View>
    );
  }

  const turno = aTurnoVista(data);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.background }]}>
        <Text style={[styles.titulo, { color: colors.text }]}>Detalle del turno</Text>
        {turno.clienteId ? (
          <ClienteTurno clienteId={turno.clienteId} nombre={turno.nombreCliente} />
        ) : (
          <Text style={[styles.cliente, { color: colors.text }]}>{turno.nombreCliente}</Text>
        )}
        <DetalleTurno turno={turno} />
        <View style={styles.footer}>
          <VolverAgendaButton />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titulo: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  card: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
  },
  footer: { marginTop: 16 },
  cliente: { fontSize: 16, fontWeight: '600', color: '#1a1f4d' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  errorText: { fontSize: 16, color: '#4a5199' },
  reintentar: { fontSize: 14, fontWeight: '600', color: '#4a5199' },
});