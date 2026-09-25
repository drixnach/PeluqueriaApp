import { SymbolView } from "expo-symbols";
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { Cliente } from "@/constants/clientes";
import { DetalleButton } from "./DetalleButton";

type ClienteCardProps = {
  clientes: Cliente[];
};

export function ClienteCard({ clientes }: ClienteCardProps) {
  return (
    <View style={styles.listaContainer}>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.objLista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <SymbolView
                name={{
                  ios: 'person.crop.circle.fill',
                  android: 'account_circle',
                  web: 'account_circle',
                }}
                tintColor="#6b7280"
                size={32}
              />
            </View>
            <View style={styles.datos}>
              <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
              <Text style={styles.telefono}>{item.telefono}</Text>
              <Text style={styles.email}>{item.correo}</Text>
            </View>

            <DetalleButton clienteId={item.id} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listaContainer: {
    flex: 1,
  },
  objLista: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e6e8eb',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  datos: {
    flex: 1,
    gap: 3,
  },
  nombre: {
    color: '#202124',
    fontWeight: '600',
    fontSize: 15,
  },
  telefono: {
    color: '#5f6368',
    fontSize: 13,
    marginTop: 2,
  },
  email: {
    color: '#7a8087',
    fontSize: 12,
  },
});