import { useState } from "react";
import { CLIENTES } from "@/constants/clientes";
import { ListaHeader } from "./ListaHeader";
import { BuscadorClientes } from "./BuscadorClientes";
import { ClienteCard } from "./ClienteCard";


export function ListaScreen() {
  const [consulta, setConsulta] = useState("");
  const consultaNormalizada = consulta.trim().toLowerCase();
  const clientesFiltrados = CLIENTES.filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido}`
      .toLowerCase()
      .includes(consultaNormalizada)
  );

  return (
    <>
      <ListaHeader />
      <BuscadorClientes consulta={consulta} onQueryChange={setConsulta} />
      <ClienteCard clientes={clientesFiltrados} />
    </>
  );
}
