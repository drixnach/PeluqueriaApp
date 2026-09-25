import { Linking, Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

type CorreoButtonProps = {
  correo: string;
};

export function CorreoButton({ correo }: CorreoButtonProps) {
  const handlePress = () => {
    Linking.openURL(`mailto:${correo}`).catch(() => {});
  };

  return (
    <Pressable onPress={handlePress} style={styles.actionBtn} hitSlop={8}>
      <SymbolView
        name={{
          ios: 'mail',
          android: 'email',
          web: 'email',
        }}
        size={24}
        tintColor="#2563eb"
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