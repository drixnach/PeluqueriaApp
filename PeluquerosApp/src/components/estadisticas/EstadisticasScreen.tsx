import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMisTurnos, aTurnoVista } from '@/api/useMisTurnos';
import { useRefetchOnFocus } from '@/api/useRefetchOnFocus';
import { claveDia } from '@/utils/fechas';
import { EstadisticasHeader } from './EstadisticasHeader';
import { MesSlider } from './MesSlider';
import { TotalServicios } from './TotalServicios';
import { TotalVentas } from './TotalVentas';
import { UltimoServicios } from './UltimoServicios';

const SOLO_REALIZADOS = false; //es para probar lo cambio a true cuando agregue los estados de realizado o pendiente o cancelado

export function EstadisticasScreen() {
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  });

  const cambiarMes = (desplazamiento: number) => {
    setMesSeleccionado((mesAnterior) =>
      new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + desplazamiento, 1)
    );
  };

  const desde = claveDia(mesSeleccionado);
  const hasta = claveDia(
    new Date(mesSeleccionado.getFullYear(), mesSeleccionado.getMonth() + 1, 1)
  );

  const { data, isLoading, isError, refetch } = useMisTurnos(desde, hasta);
  useRefetchOnFocus(refetch);

  const ahora = new Date();
  const ahoraTexto = `${claveDia(ahora)} ${String(ahora.getHours()).padStart(2, '0')}:${String(
    ahora.getMinutes()
  ).padStart(2, '0')}`;

  const turnosDelMes = (data ?? [])
    .map(aTurnoVista)
    .filter((turno) => !SOLO_REALIZADOS || `${turno.fecha} ${turno.hora}` <= ahoraTexto);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      <EstadisticasHeader />
      <MesSlider mes={mesSeleccionado} onCambiarMes={cambiarMes} />

      {isLoading ? (
        <ActivityIndicator style={styles.estado} />
      ) : isError ? (
        <Pressable onPress={() => refetch()} style={styles.estado}>
          <Text>No se pudieron cargar las estadísticas. Tocá para reintentar.</Text>
        </Pressable>
      ) : (
        <>
          <View style={styles.tarjetas}>
            <TotalVentas turnos={turnosDelMes} />
            <TotalServicios turnos={turnosDelMes} />
          </View>
          <UltimoServicios turnos={turnosDelMes} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contenido: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 24,
    gap: 16,
  },
  tarjetas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  estado: {
  paddingVertical: 32,
  alignItems: 'center',
},
});
