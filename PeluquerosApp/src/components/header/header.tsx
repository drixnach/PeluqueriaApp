import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Header() {
    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Peluquería</Text>
                <Image
                    source={require('../../../assets/images/logo-pelu.png')}
                    style={styles.logo}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fff",
        borderBottomWidth: 2,
        borderBottomColor: "#d7d9f0",
    },
    container: {
        minHeight: 52,
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row",
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        position: 'relative',
    },
    titulo: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 22,
        fontStyle: 'italic',
        fontWeight: '600',
        color: "#333c87",
        letterSpacing: 0.8,
    },
    logo: {
        width: 64,
        height: 64,
        marginRight: 4,
        resizeMode: "contain",
    }
});
