import { StyleSheet, View } from 'react-native';
import Header from '@/components/header/header';
import GaleriaScreen from '@/components/galeria/GaleriaScreen';

export default function Galeria() {
  return (
    <View style={styles.container}>
      <Header />
      <GaleriaScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
