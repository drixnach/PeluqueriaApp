import { DetalleScreen } from "@/components/cliente-detalle/DetalleScreen";
import { StyleSheet, View } from "react-native";
import Header from "@/components/header/header";

export default function ClienteDetalle() {
  return (
    <View style={styles.container}>
      <Header />
      <DetalleScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});