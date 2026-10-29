import { StyleSheet, View } from 'react-native';
import Header from '@/components/header/header';
import GaleriaScreen from '@/components/galeria/GaleriaScreen';
import { useTheme } from '@/theme/ThemeProvider';

export default function Galeria() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <GaleriaScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

