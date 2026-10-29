import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ModoOscuroButton from "../modo-oscuro/ModoOscuroButton";
import { useTheme } from "@/theme/ThemeProvider";


export default function Header() {
    const { colors } = useTheme();

    return (
        <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: colors.tabBar, borderBottomColor: colors.border }]}>
            <View style={[styles.container, { backgroundColor: colors.tabBar }]}>
                <View style={styles.leftContainer}>
                    <ModoOscuroButton />
                </View>
                <Text style={[styles.titulo, { color: colors.primary }]}>Peluquería</Text>
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
        borderBottomWidth: 2,
    },
    container: {
        minHeight: 52,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 10,
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
        letterSpacing: 0.8,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    logo: {
        width: 64,
        height: 64,
        marginRight: 4,
        resizeMode: "contain",
        zIndex: 1,
    }
});


