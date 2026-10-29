import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';
import type { TurnoVista } from '@/api/useMisTurnos';
import { useTheme } from '@/theme/ThemeProvider';

type TotalServiciosProps = {
  turnos: TurnoVista[];
};

export function TotalServicios({ turnos }: TotalServiciosProps) {
  const { colors } = useTheme();
  const cantidadTurnos = turnos.length;
  const diasConTurnos = new Set(turnos.map((turno) => turno.fecha)).size;
  const promedioServicios = diasConTurnos > 0 ? cantidadTurnos / diasConTurnos : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary }]}>
      <View style={styles.filaTitulo}>
        <Text style={[styles.titulo, { color: colors.primaryInactive }]}>SERVICIOS</Text>
        <SymbolView
          name={{
            ios: 'scissors',
            android: 'content_cut',
            web: 'content_cut',
          }}
          tintColor={colors.primaryInactive}
          size={22}
        />
      </View>

      <View style={styles.contenido}>
        <Text style={[styles.monto, { color: colors.text }]}>{cantidadTurnos}</Text>
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
  promedioServicios: {
    fontSize: 13,
    fontWeight: '500',
    color: '#16a34a',
  },
});
