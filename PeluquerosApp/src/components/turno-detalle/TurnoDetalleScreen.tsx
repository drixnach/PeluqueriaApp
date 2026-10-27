import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CLIENTES } from '@/constants/clientes';
import { TURNOS } from '@/constants/turnos';
import { ClienteTurno } from '@/components/turno-detalle/ClienteTurno';
import { DetalleTurno } from '@/components/turno-detalle/DetalleTurno';
import { VolverAgendaButton } from '@/components/turno-detalle/VolverAgendaButton';

export function TurnoDetalleScreen() {
  const { id } = useLocalSearchParams();
  const turnoId = Array.isArray(id) ? id[0] : id;
  const turno = TURNOS.find((t) => t.id === turnoId);

  if (!turno) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Turno no encontrado</Text>
      </View>
    );
  }

  const cliente = CLIENTES.find((c) => c.id === turno.clienteId);
  const nombreCliente = cliente
    ? `${cliente.nombre} ${cliente.apellido}`
    : 'Cliente';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Detalle del turno</Text>
        {cliente ? (
          <ClienteTurno cliente={cliente} />
        ) : (
          <Text style={styles.cliente}>{nombreCliente}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1f4d',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
  },
  footer: {
    marginTop: 16,
  },
  cliente: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1f4d',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#4a5199',
  },
});
