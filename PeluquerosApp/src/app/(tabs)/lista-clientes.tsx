import { ListaScreen } from "@/components/lista-clientes/ListaScreen";
import { StyleSheet, View } from "react-native";
import Header from "@/components/header/header";

export default function ListaClientes(){
    return(
    <View style={styles.container}>
    <Header/>
    <ListaScreen/>
    </View>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});