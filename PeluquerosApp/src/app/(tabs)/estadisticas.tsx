import { View, StyleSheet } from 'react-native';
import Header from '@/components/header/header';
import { EstadisticasScreen } from '@/components/estadisticas/EstadisticasScreen';
import { useTheme } from '@/theme/ThemeProvider';

export default function Estadisticas() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <EstadisticasScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

