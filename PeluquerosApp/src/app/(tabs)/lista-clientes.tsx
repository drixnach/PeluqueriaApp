import { ListaScreen } from "@/components/lista-clientes/ListaScreen";
import { StyleSheet, View } from "react-native";
import Header from "@/components/header/header";
import { useTheme } from "@/theme/ThemeProvider";

export default function ListaClientes(){
    const { colors } = useTheme();
    return(
    <View style={[styles.container, { backgroundColor: colors.background }]}>
    <Header/>
    <ListaScreen/>
    </View>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
