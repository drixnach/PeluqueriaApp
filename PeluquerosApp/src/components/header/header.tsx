import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Header() {
    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Peluqueria Cervantes</Text>
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
        borderBottomColor: "#e6e8eb",
    },
    container: {
        minHeight: 52,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#202124",
        letterSpacing: -0.2,
    },
    logo: {
        width: 64,
        height: 64,
        marginRight: 4,
        resizeMode: "contain",
    }
});
