import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

type DetalleButtonProps = {
  clienteId: string;
};

export function DetalleButton({ clienteId }: DetalleButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={() => router.push({ pathname: '/cliente-detalle', params: { id: clienteId } })}
      hitSlop={8}
    >
      <SymbolView
        name={{
          ios: 'info.circle',
          android: 'info',
          web: 'info',
        }}
        size={18}
        tintColor="#5f6368"
        style={styles.icon}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e6e8eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  icon: {
    width: 20,
    height: 20,
  },
});