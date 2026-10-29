import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useMisClientes, aClienteVista } from "@/api/useMisClientes";
import { ListaHeader } from "./ListaHeader";
import { BuscadorClientes } from "./BuscadorClientes";
import { ClienteCard } from "./ClienteCard";
import { useRefetchOnFocus } from "@/api/useRefetchOnFocus";
import { useTheme } from "@/theme/ThemeProvider";

export function ListaScreen() {
  const { colors } = useTheme();
  const [consulta, setConsulta] = useState("");
  const { data, isLoading, isError, refetch } = useMisClientes();
  useRefetchOnFocus(refetch);

  const clientes = (data ?? []).map(aClienteVista);
  const consultaNormalizada = consulta.trim().toLowerCase();
  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido}`
      .toLowerCase()
      .includes(consultaNormalizada)
  );

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ListaHeader total={clientes.length} />
      <BuscadorClientes consulta={consulta} onQueryChange={setConsulta} />

      {isLoading ? (
        <ActivityIndicator style={styles.estado} color={colors.primary} />
      ) : isError ? (
        <Pressable onPress={() => refetch()} style={styles.estado}>
          <Text style={[styles.texto, { color: colors.muted }]}>No se pudieron cargar los clientes. Tocá para reintentar.</Text>
        </Pressable>
      ) : clientesFiltrados.length === 0 ? (
        <View style={styles.estado}>
          <Text style={[styles.texto, { color: colors.muted }]}>
            {consultaNormalizada ? "Sin resultados" : "Todavía no tenés clientes con turnos"}
          </Text>
        </View>
      ) : (
        <ClienteCard clientes={clientesFiltrados} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  estado: {
    paddingVertical: 32,
    alignItems: "center",
  },
  texto: {
    fontSize: 14,
  },
});
