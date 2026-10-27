import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GrillaFotos from './GrillaFotos';
import CamaraButton from './CamaraButton';
import GaleriaButton from './GaleriaButton';
import { useGaleriaStore } from '@/store/galeriaStore';

export default function GaleriaScreen() {
  const { fotos, agregarFoto } = useGaleriaStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.contenido}>
        <GrillaFotos fotos={fotos} />
      </View>
      <View
        style={[
          styles.botonesContainer,
          {
            bottom: insets.bottom + 60,
          },
        ]}
      >
        <CamaraButton onFotoTomada={(uri) => agregarFoto(uri)} />
        <GaleriaButton onFotoSeleccionada={(uri) => agregarFoto(uri)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contenido: {
    flex: 1,
  },
  botonesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 8,
  },
});
