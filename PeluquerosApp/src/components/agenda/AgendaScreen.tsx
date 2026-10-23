import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TURNOS } from '@/constants/turnos';
import { claveDia } from '@/utils/fechas';
import { AgendaHeader } from './AgendaHeader';
import { DiasSlider } from './DiasSlider';
import { TurnoCard } from './TurnoCard';

export function AgendaScreen() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  });

  const turnosDelDia = TURNOS.filter(
    (turno) => turno.fecha === claveDia(fechaSeleccionada)
  ).sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <AgendaHeader fecha={fechaSeleccionada} />
      </View>
      <DiasSlider
        fechaSeleccionada={fechaSeleccionada}
        onSeleccionarDia={setFechaSeleccionada}
      />
      <TurnoCard turnos={turnosDelDia} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 22,
  },
  encabezado: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
