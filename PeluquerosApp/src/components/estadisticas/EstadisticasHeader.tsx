import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function EstadisticasHeader() {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.titulo, { color: colors.text }]}>Estadísticas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
});
