import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Header() {
    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Peluqueria</Text>
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
        backgroundColor: "#f0f0f0",
    },
    container: {
        minHeight: 52,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 10,
        backgroundColor: "#f0f0f0",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#202124",
    },
    logo: {
        width: 86,
        height: 86,
        marginRight: 2,
        resizeMode: "contain",
    }
});
