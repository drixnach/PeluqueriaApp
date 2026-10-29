import { StyleSheet, View } from 'react-native';
import Header from '@/components/header/header';
import { TurnoDetalleScreen } from '@/components/turno-detalle/TurnoDetalleScreen';
import { useTheme } from '@/theme/ThemeProvider';

export default function TurnoDetalle() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <TurnoDetalleScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

