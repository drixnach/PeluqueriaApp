import { StyleSheet, View } from 'react-native';
import Header from '@/components/header/header';
import { AgendaScreen } from '../../components/agenda/AgendaScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <AgendaScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
