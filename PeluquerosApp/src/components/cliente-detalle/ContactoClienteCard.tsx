import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { Cliente } from '@/constants/clientes';
import { CorreoButton } from './CorreoButton';
import { TelefonoButton } from './TelefonoButton';

type ContactoClienteCardProps = {
  cliente: Cliente;
};

export function ContactoClienteCard({ cliente }: ContactoClienteCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <SymbolView
          name={{
            ios: 'person.crop.circle.fill',
            android: 'account_circle',
            web: 'account_circle',
          }}
          size={88}
          tintColor="#6b7280"
        />
        <Text style={styles.nombre}>{cliente.nombre} {cliente.apellido}</Text>
      </View>

      <View style={styles.lineaDivisoria} />

      <View style={styles.fila}>
        <Text style={styles.infoText}>{cliente.correo}</Text>
        <CorreoButton correo={cliente.correo} />
      </View>

      <View style={styles.fila}>
        <Text style={styles.infoText}>{cliente.telefono}</Text>
        <TelefonoButton telefono={cliente.telefono} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nombre: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '600',
    color: '#202124',
    textAlign: 'center',
  },
  lineaDivisoria : {
    height: 1,
    backgroundColor: '#e6e8eb',
    marginHorizontal: 16,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#3c4043',
  },
});