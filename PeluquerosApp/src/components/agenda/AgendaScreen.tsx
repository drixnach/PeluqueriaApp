import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMisTurnos, aTurnoVista } from '@/api/useMisTurnos';
import { claveDia, inicioDeSemana, sumarDias } from '@/utils/fechas';
import { AgendaHeader } from './AgendaHeader';
import { DiasSlider } from './DiasSlider';
import { TurnoCard } from './TurnoCard';
import { useRefetchOnFocus } from '@/api/useRefetchOnFocus';


export function AgendaScreen() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  });

  const lunes=inicioDeSemana(fechaSeleccionada)
  const {data, isLoading, isError, refetch }= useMisTurnos(claveDia(lunes), claveDia(sumarDias(lunes,7)))
  useRefetchOnFocus(refetch)
  const diaIso=claveDia(fechaSeleccionada)
  const turnosDelDia=(data??[]).map(aTurnoVista).filter((turno)=>turno.fecha===diaIso).sort((a,b)=>a.hora.localeCompare(b.hora))
  
  return(
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <AgendaHeader fecha={fechaSeleccionada} />
      </View>
      <DiasSlider
        fechaSeleccionada={fechaSeleccionada}
        onSeleccionarDia={setFechaSeleccionada}
      />

      {isLoading ? (
        <ActivityIndicator style={styles.estado} />
      ) : isError ? (
        <Pressable onPress={() => refetch()} style={styles.estado}>
          <Text>No se pudo cargar la agenda. Tocá para reintentar.</Text>
        </Pressable>
      ) : (
        <TurnoCard turnos={turnosDelDia} />
      )}
    </View>
  )
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
  estado: {
    paddingVertical: 32,
    alignItems: 'center',
  },
});