import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type AgendaHeaderProps = {
  fecha: Date;
};

export function AgendaHeader({ fecha }: AgendaHeaderProps) {
  const { colors } = useTheme();
  const mes = new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(fecha);
  const titulo = `Agenda de ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;

  return (
    <View>
      <Text style={[styles.titulo, { color: colors.text }]}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
});

