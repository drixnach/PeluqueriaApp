import { View, StyleSheet } from 'react-native';
import Header from '@/components/header/header';
import { EstadisticasScreen } from '@/components/estadisticas/EstadisticasScreen';

export default function Estadisticas() {
  return (
    <View style={styles.container}>
      <Header />
      <EstadisticasScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
