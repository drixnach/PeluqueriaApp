import { StyleSheet, Text, View } from 'react-native';
import type { TurnoVista } from '@/api/useMisTurnos';
import { useTheme } from '@/theme/ThemeProvider';

type UltimoServiciosProps = {
  turnos: TurnoVista[];
};

export function UltimoServicios({ turnos }: UltimoServiciosProps) {
  const { colors } = useTheme();
  const ultimosTurnos = [...turnos]
    .sort((a, b) => `${b.fecha} ${b.hora}`.localeCompare(`${a.fecha} ${a.hora}`))
    .slice(0, 4);

  return (
    <View style={styles.contenedor}>
      <Text style={[styles.titulo, { color: colors.text }]}>Últimos Servicios</Text>

      {ultimosTurnos.length === 0 ? (
        <Text
          style={[
            styles.vacio,
            { color: colors.muted, backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          Sin servicios este mes
        </Text>
      ) : (
        ultimosTurnos.map((turno) => {
          const [, mes, dia] = turno.fecha.split('-');

          return (
            <View
              key={turno.id}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
              ]}
            >
              <View style={[styles.cuadradoFecha, { backgroundColor: colors.inputBackground }]}>
                <Text style={[styles.fecha, { color: colors.text }]}>
                  {dia}/{mes}
                </Text>
                <Text style={[styles.hora, { color: colors.primaryInactive }]}>{turno.hora}</Text>
              </View>

              <View style={styles.datos}>
                <Text style={[styles.nombre, { color: colors.text }]} numberOfLines={1}>
                  {turno.nombreCliente}
                </Text>
                <Text style={[styles.servicio, { color: colors.primaryInactive }]} numberOfLines={1}>
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
    marginBottom: 12,
  },
  vacio: {
    fontSize: 14,
    textAlign: 'center',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
  },
  cuadradoFecha: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  fecha: {
    fontSize: 14,
    fontWeight: '700',
  },
  hora: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  datos: {
    flex: 1,
    marginRight: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  servicio: {
    fontSize: 13,
  },
  precio: {
    fontSize: 17,
    fontWeight: '700',
    color: '#16a34a',
  },
});
