import { StyleSheet, Text, View } from 'react-native';
import { CLIENTES } from '@/constants/clientes';
import type { Turno } from '@/constants/turnos';

type UltimoServiciosProps = {
  turnos: Turno[];
};

export function UltimoServicios({ turnos }: UltimoServiciosProps) {
  const ultimosTurnos = [...turnos]
    .sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`).getTime();
      const fechaB = new Date(`${b.fecha}T${b.hora}`).getTime();
      return fechaB - fechaA;
    })
    .slice(0, 4);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Últimos Servicios</Text>

      {ultimosTurnos.length === 0 ? (
        <Text style={styles.vacio}>Sin servicios este mes</Text>
      ) : (
        ultimosTurnos.map((turno) => {
          const cliente = CLIENTES.find((c) => c.id === turno.clienteId);
          const [, mes, dia] = turno.fecha.split('-');

          return (
            <View key={turno.id} style={styles.card}>
              <View style={styles.cuadradoFecha}>
                <Text style={styles.fecha}>
                  <Text style={styles.dia}>{dia}</Text>
                  <Text style={styles.mes}>/{mes}</Text>
                </Text>
                <Text style={styles.hora}>{turno.hora}</Text>
              </View>

              <View style={styles.datos}>
                <Text style={styles.nombre} numberOfLines={1}>
                  {cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente'}
                </Text>
                <Text style={styles.servicio} numberOfLines={1}>
                  {turno.servicio}
                </Text>
              </View>

              <Text style={styles.precio}>${turno.monto.toLocaleString('es-AR')}</Text>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginTop: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  vacio: {
    fontSize: 14,
    color: '#5f6368',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e6e8eb',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e6e8eb',
  },
  cuadradoFecha: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  fecha: {
    fontSize: 14,
    fontWeight: '700',
  },
  dia: {
    color: '#202124',
  },
  mes: {
    color: '#202124',
  },
  hora: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9aa0a6',
    marginTop: 2,
  },
  datos: {
    flex: 1,
    marginRight: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  servicio: {
    fontSize: 13,
    color: '#7a8087',
  },
  precio: {
    fontSize: 17,
    fontWeight: '700',
    color: '#16a34a',
  },
});
