import { LoginScreen } from '@/components/login/LoginScreen';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function Login() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LoginScreen />
    </View>
  );
}
