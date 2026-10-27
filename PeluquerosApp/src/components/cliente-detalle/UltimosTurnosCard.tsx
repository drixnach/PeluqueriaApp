import { StyleSheet, Text, View } from 'react-native';
import type { Cliente } from '@/constants/clientes';
import { TURNOS } from '@/constants/turnos';

type UltimosTurnosCardProps = {
  cliente: Cliente;
};

export function UltimosTurnosCard({ cliente }: UltimosTurnosCardProps) {
  const turnosCliente = TURNOS.filter((t) => t.clienteId === cliente.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 3);

  return (
    <View style={styles.containerCard}>
      <Text style={styles.titulo}>Últimos Turnos</Text>
      {turnosCliente.map((turno, index) => (
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
      ))}
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