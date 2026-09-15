import { StyleSheet, Text, View } from 'react-native';
import { CLIENTES } from '@/constants/clientes';

export function ListaHeader(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Clientes</Text>
            <Text style={styles.subtitle}>{CLIENTES.length} registrados</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 22,
        paddingBottom: 4,
    },
    title: {
        color: '#202124',
        fontSize: 26,
        fontWeight: '700',
        letterSpacing: -0.4,
    },
    subtitle: {
        color: '#7a8087',
        fontSize: 13,
        marginTop: 4,
    },
});
