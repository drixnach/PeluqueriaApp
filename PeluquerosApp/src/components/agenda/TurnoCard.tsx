import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { TurnoVista } from '@/api/useMisTurnos';
import { useTheme } from '@/theme/ThemeProvider';

type TurnoCardProps = {
  turnos: TurnoVista[];
};

export function TurnoCard({ turnos }: TurnoCardProps) {
  const { colors } = useTheme();
  return (
    <FlatList
      data={turnos}
      keyExtractor={(item) => item.id}
      style={styles.lista}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.vacio}>
          <Text style={[styles.textoVacio, { color: colors.primaryInactive }]}>No hay turnos para este día</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.cardPressed]}
          onPress={() =>
            router.push({ pathname: '/turno-detalle', params: { id: item.id } })
          }
        >
          <Text style={[styles.hora, { color: colors.primaryInactive }]}>{item.hora}</Text>
          <View style={styles.filaPrincipal}>
            <Text style={[styles.cliente, { color: colors.text }]} numberOfLines={1}>
              {item.nombreCliente}
            </Text>
            <Text style={styles.precio}>
              ${item.monto.toLocaleString('es-AR')}
            </Text>
          </View>
          <Text style={[styles.servicio, { color: colors.primaryInactive }]}>{item.servicio}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
  },
  contenido: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#333c87',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.6,
  },
  hora: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  filaPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cliente: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  precio: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
  },
  servicio: {
    marginTop: 4,
    fontSize: 13,
  },
  vacio: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  textoVacio: {
    fontSize: 14,
  },
});

