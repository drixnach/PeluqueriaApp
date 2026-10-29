import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { CorreoButton } from './CorreoButton';
import { TelefonoButton } from './TelefonoButton';
import { ClienteVista } from '@/api/useMisClientes';
import { useTheme } from '@/theme/ThemeProvider';

type ContactoClienteCardProps = {
  cliente: ClienteVista;
};

export function ContactoClienteCard({ cliente }: ContactoClienteCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}>
      <View style={styles.header}>
        <SymbolView
          name={{
            ios: 'person.crop.circle.fill',
            android: 'account_circle',
            web: 'account_circle',
          }}
          size={88}
          tintColor={colors.primaryInactive}
        />
        <Text style={[styles.nombre, { color: colors.text }]}>{cliente.nombre} {cliente.apellido}</Text>
      </View>

      <View style={[styles.lineaDivisoria, { backgroundColor: colors.border }]} />

      <View style={styles.fila}>
        <Text style={[styles.infoText, { color: colors.primaryInactive }]}>{cliente.correo}</Text>
        <CorreoButton correo={cliente.correo} />
      </View>

      <View style={styles.fila}>
        <Text style={[styles.infoText, { color: colors.primaryInactive }]}>{cliente.telefono}</Text>
        <TelefonoButton telefono={cliente.telefono} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
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
    textAlign: 'center',
  },
  lineaDivisoria : {
    height: 1,
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
  },
});
