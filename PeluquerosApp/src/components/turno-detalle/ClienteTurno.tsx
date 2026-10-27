import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { Cliente } from '@/constants/clientes';

type ClienteTurnoProps = {
  cliente: Cliente;
};

export function ClienteTurno({ cliente }: ClienteTurnoProps) {
  return (
    <View style={styles.fila}>
      <View style={styles.avatar}>
        <SymbolView
          name={{
            ios: 'person.crop.circle.fill',
            android: 'account_circle',
            web: 'account_circle',
          }}
          size={32}
          tintColor="#4a5199"
        />
      </View>

      <Text style={styles.nombre} numberOfLines={1}>
        {cliente.nombre} {cliente.apellido}
      </Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() =>
          router.push({ pathname: '/cliente-detalle', params: { id: cliente.id } })
        }
        hitSlop={8}
      >
        <Text style={styles.buttonText}>Ver cliente</Text>
        <SymbolView
          name={{
            ios: 'chevron.right',
            android: 'chevron_right',
            web: 'chevron_right',
          }}
          size={16}
          tintColor="#4a5199"
          style={styles.icon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nombre: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1f4d',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e6e8eb',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3c4043',
  },
  icon: {
    width: 16,
    height: 16,
  },
});
