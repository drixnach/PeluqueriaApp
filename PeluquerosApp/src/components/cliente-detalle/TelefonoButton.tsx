import { Linking, Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

type TelefonoButtonProps = {
  telefono: string;
};

export function TelefonoButton({ telefono }: TelefonoButtonProps) {
  const telefonoLimpio = telefono.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/54${telefonoLimpio}`;

  const handlePress = () => {
    Linking.openURL(whatsappUrl).catch(() => {});
  };

  return (
    <Pressable onPress={handlePress} style={styles.actionBtn} hitSlop={8}>
      <SymbolView
        name={{
          ios: 'message',
          android: 'chat',
          web: 'chat',
        }}
        size={24}
        tintColor="#25d366"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionBtn: {
    minWidth: 48,
    minHeight: 48,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});