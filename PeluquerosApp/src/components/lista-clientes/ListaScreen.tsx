import { useState } from "react";
import { CLIENTES } from "@/constants/clientes";
import { ListaHeader } from "./ListaHeader";
import { BuscadorClientes } from "./BuscadorClientes";
import { ClienteCard } from "./ClienteCard";


export function ListaScreen() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const clientesFiltrados = CLIENTES.filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido}`
      .toLowerCase()
      .includes(normalizedQuery)
  );

  return (
    <>
      <ListaHeader />
      <BuscadorClientes query={query} onQueryChange={setQuery} />
      <ClienteCard clientes={clientesFiltrados} />
    </>
  );
}
