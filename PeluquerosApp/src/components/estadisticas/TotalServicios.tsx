import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';
import type { Turno } from '@/constants/turnos';

type TotalServiciosProps = {
  turnos: Turno[];
};

export function TotalServicios({ turnos }: TotalServiciosProps) {
  const cantidadTurnos = turnos.length;
  const diasConTurnos = new Set(turnos.map((turno) => turno.fecha)).size;
  const promedioServicios = diasConTurnos > 0 ? cantidadTurnos / diasConTurnos : 0;

  return (
    <View style={styles.card}>
      <View style={styles.filaTitulo}>
        <Text style={styles.titulo}>SERVICIOS</Text>
        <SymbolView
          name={{
            ios: 'scissors',
            android: 'content_cut',
            web: 'content_cut',
          }}
          tintColor="#5f6368"
          size={22}
        />
      </View>

      <View style={styles.contenido}>
        <Text style={styles.monto}>{cantidadTurnos}</Text>
        <Text style={styles.promedioServicios}>
          {promedioServicios.toLocaleString('es-AR', { maximumFractionDigits: 1 })} servicios por
          día
        </Text>
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
  promedioServicios: {
    fontSize: 13,
    fontWeight: '500',
    color: '#16a34a',
  },
});
