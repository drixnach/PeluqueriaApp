import { DetalleScreen } from "@/components/cliente-detalle/DetalleScreen";
import { StyleSheet, View } from "react-native";
import Header from "@/components/header/header";
import { useTheme } from "@/theme/ThemeProvider";

export default function ClienteDetalle() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <DetalleScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
