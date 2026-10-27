import { StyleSheet, Text, View } from 'react-native';

type ListaHeaderProps = {
    total: number;
};

export function ListaHeader({ total }: ListaHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Clientes</Text>
            <Text style={styles.subtitulo}>{total} registrados</Text>
        </View>
    );
}

// los styles quedan igual

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 22,
        paddingBottom: 4,
    },
    titulo: {
        color: '#202124',
        fontSize: 26,
        fontWeight: '700',
        letterSpacing: -0.4,
    },
    subtitulo: {
        color: '#4a5199',
        fontSize: 13,
        marginTop: 4,
    },
});
