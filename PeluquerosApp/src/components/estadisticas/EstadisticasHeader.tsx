import { StyleSheet, Text, View } from 'react-native';

export function EstadisticasHeader() {
  return (
    <View>
      <Text style={styles.titulo}>Estadísticas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    color: '#202124',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
});
