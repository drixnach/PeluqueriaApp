import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CLIENTES } from '@/constants/clientes';
import { ContactoClienteCard } from '@/components/cliente-detalle/ContactoClienteCard';
import { UltimosTurnosCard } from '@/components/cliente-detalle/UltimosTurnosCard';

export function DetalleScreen() {
  const { id } = useLocalSearchParams();
  const clienteId = Array.isArray(id) ? id[0] : id;
  const cliente = CLIENTES.find((c) => c.id === clienteId);

  if (!cliente) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <ContactoClienteCard cliente={cliente} />
      <UltimosTurnosCard cliente={cliente} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#5f6368',
  },
});