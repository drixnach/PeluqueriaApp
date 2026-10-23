import { StyleSheet, Text, View } from 'react-native';

type AgendaHeaderProps = {
  fecha: Date;
};

export function AgendaHeader({ fecha }: AgendaHeaderProps) {
  const mes = new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(fecha);
  const titulo = `Agenda de ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;

  return (
    <View>
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    color: '#202124',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
});
