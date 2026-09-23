import { SymbolView } from "expo-symbols";
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { Cliente } from "@/constants/clientes";

type ClienteCardProps = {
  clientes: Cliente[];
};

export function ClienteCard({ clientes }: ClienteCardProps){
    return(
    <View style={styles.listContainer}>
        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
                
                <Pressable
                  style={({ pressed }) => [styles.botonInfo, pressed && styles.botonInfoPressed]}
                  onPress={() =>
                  router.push({
                      pathname: '/cliente-detalle',
                      params: { id: item.id },
                    })
                  }
                  hitSlop={8}
                >
                <SymbolView
                  name={{
                    ios: 'info.circle',
                    android: 'info',
                    web: 'info',
                  }}
                  tintColor="#5f6368"
                  size={18}
                  style={styles.infoIcono}
                />
              </Pressable>

            </View>
          )}
        />

    </View>
    )
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  listContent: {
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
  botonInfo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e6e8eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  botonInfoPressed: {
    opacity: 0.6,
  },
  infoIcono: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

