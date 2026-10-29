import { StyleSheet, View } from 'react-native';
import Header from '@/components/header/header';
import { AgendaScreen } from '../../components/agenda/AgendaScreen';
import { useTheme } from '@/theme/ThemeProvider';

export default function App() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <AgendaScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

