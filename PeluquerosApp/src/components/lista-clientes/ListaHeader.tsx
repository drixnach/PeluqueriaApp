import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type ListaHeaderProps = {
    total: number;
};

export function ListaHeader({ total }: ListaHeaderProps) {
    const { colors } = useTheme();
    return (
        <View style={styles.container}>
            <Text style={[styles.titulo, { color: colors.text }]}>Clientes</Text>
            <Text style={[styles.subtitulo, { color: colors.primaryInactive }]}>{total} registrados</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 22,
        paddingBottom: 4,
    },
    titulo: {
        fontSize: 26,
        fontWeight: '700',
        letterSpacing: -0.4,
    },
    subtitulo: {
        fontSize: 13,
        marginTop: 4,
    },
});

