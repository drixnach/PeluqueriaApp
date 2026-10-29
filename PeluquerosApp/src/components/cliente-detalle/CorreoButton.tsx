import { Linking, Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/theme/ThemeProvider';

type CorreoButtonProps = {
  correo: string;
};

export function CorreoButton({ correo }: CorreoButtonProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    Linking.openURL(`mailto:${correo}`).catch(() => {});
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.actionBtn, { backgroundColor: colors.inputBackground }]}
      hitSlop={8}
    >
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});