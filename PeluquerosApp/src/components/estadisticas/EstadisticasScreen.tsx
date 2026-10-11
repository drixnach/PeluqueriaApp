import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TURNOS } from '@/constants/turnos';
import { EstadisticasHeader } from './EstadisticasHeader';
import { MesSlider } from './MesSlider';
import { TotalServicios } from './TotalServicios';
import { TotalVentas } from './TotalVentas';
import { UltimoServicios } from './UltimoServicios';

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

  const periodo = `${mesSeleccionado.getFullYear()}-${String(mesSeleccionado.getMonth() + 1).padStart(2, '0')}`;
  const turnosDelMes = TURNOS.filter((turno) => turno.fecha.slice(0, 7) === periodo);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      <EstadisticasHeader />
      <MesSlider mes={mesSeleccionado} onCambiarMes={cambiarMes} />
      <View style={styles.tarjetas}>
        <TotalVentas turnos={turnosDelMes} />
        <TotalServicios turnos={turnosDelMes} />
      </View>
      <UltimoServicios turnos={turnosDelMes} />
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
});
