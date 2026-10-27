import { ActivityIndicator, Pressable, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMiCliente, aClienteVista } from '@/api/useMisClientes';
import { ContactoClienteCard } from '@/components/cliente-detalle/ContactoClienteCard';
import { UltimosTurnosCard } from '@/components/cliente-detalle/UltimosTurnosCard';

export function DetalleScreen() {
  const { id } = useLocalSearchParams();
  const clienteId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading, isError, error, refetch } = useMiCliente(clienteId);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error?.message ?? 'Error al cargar el cliente'}</Text>
        <Pressable onPress={() => refetch()} hitSlop={8}>
          <Text style={styles.reintentar}>Tocá para reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Cliente no encontrado</Text>
      </View>
    );
  }

  const cliente = aClienteVista(data);

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
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#5f6368',
  },
  reintentar: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3c4043',
  },
});