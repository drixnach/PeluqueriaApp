import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useMisClientes, aClienteVista } from "@/api/useMisClientes";
import { ListaHeader } from "./ListaHeader";
import { BuscadorClientes } from "./BuscadorClientes";
import { ClienteCard } from "./ClienteCard";
import { useRefetchOnFocus } from "@/api/useRefetchOnFocus";

export function ListaScreen() {
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
    <>
      <ListaHeader total={clientes.length} />
      <BuscadorClientes consulta={consulta} onQueryChange={setConsulta} />

      {isLoading ? (
        <ActivityIndicator style={styles.estado} />
      ) : isError ? (
        <Pressable onPress={() => refetch()} style={styles.estado}>
          <Text style={styles.texto}>No se pudieron cargar los clientes. Tocá para reintentar.</Text>
        </Pressable>
      ) : clientesFiltrados.length === 0 ? (
        <View style={styles.estado}>
          <Text style={styles.texto}>
            {consultaNormalizada ? "Sin resultados" : "Todavía no tenés clientes con turnos"}
          </Text>
        </View>
      ) : (
        <ClienteCard clientes={clientesFiltrados} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  estado: {
    paddingVertical: 32,
    alignItems: "center",
  },
  texto: {
    fontSize: 14,
    color: "#5f6368",
  },
});