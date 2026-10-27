import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { ClienteVista } from '@/api/useMisClientes';
import { useTurnosDeCliente, aTurnoVista } from '@/api/useMisTurnos';

type UltimosTurnosCardProps = {
  cliente: ClienteVista;
};

export function UltimosTurnosCard({ cliente }: UltimosTurnosCardProps) {
  const { data, isLoading, isError } = useTurnosDeCliente(cliente.id);

  const turnosCliente = (data ?? [])
    .map(aTurnoVista)
    .sort((a, b) => `${b.fecha} ${b.hora}`.localeCompare(`${a.fecha} ${a.hora}`))
    .slice(0, 3);

  return (
    <View style={styles.containerCard}>
      <Text style={styles.titulo}>Últimos Turnos</Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <Text style={styles.vacio}>No se pudieron cargar los turnos</Text>
      ) : turnosCliente.length === 0 ? (
        <Text style={styles.vacio}>Todavía no hay turnos</Text>
      ) : (
        turnosCliente.map((turno, index) => (
          <View key={turno.id}>
            <View style={styles.turnoItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.servicio}>{turno.servicio}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.fecha}>{formatoFecha(turno.fecha)}</Text>
                  <Text style={styles.separador}>·</Text>
                  <Text style={styles.peluquero}>{turno.peluquero}</Text>
                </View>
              </View>
              <Text style={styles.monto}>${turno.monto.toLocaleString('es-AR')}</Text>
            </View>
            {index < turnosCliente.length - 1 && <View style={styles.lineaDivisoria} />}
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#333c87',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#d7d9f0',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1f4d',
    marginBottom: 16,
  },
  vacio: {
    fontSize: 14,
    color: '#5f6368',
  },
  turnoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  lineaDivisoria: {
    height: 1,
    backgroundColor: '#d7d9f0',
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
    color: '#1a1f4d',
    marginBottom: 6,
  },
  fecha: {
    fontSize: 13,
    color: '#4a5199',
  },
  separador: {
    fontSize: 13,
    color: '#7c81c9',
  },
  peluquero: {
    fontSize: 13,
    color: '#4a5199',
    fontWeight: '500',
  },
  monto: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    marginLeft: 12,
  },
});