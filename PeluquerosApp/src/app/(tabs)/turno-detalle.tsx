import { StyleSheet, View } from 'react-native';
import Header from '@/components/header/header';
import { TurnoDetalleScreen } from '@/components/turno-detalle/TurnoDetalleScreen';

export default function TurnoDetalle() {
  return (
    <View style={styles.container}>
      <Header />
      <TurnoDetalleScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
