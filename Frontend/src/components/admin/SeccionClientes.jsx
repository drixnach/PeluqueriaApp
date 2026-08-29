import { useState } from 'react';
import DirectorioClientes from './DirectorioClientes';
import FormularioCliente from './FormularioCliente';

export default function SeccionClientes({ clientesGlobales, setClientesGlobales, cargarClientes }) {
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [clienteEnEdicion, setClienteEnEdicion] = useState(null);

  const abrirParaEditar = (cliente) => {
    setClienteEnEdicion(cliente);
    setMostrandoFormulario(true);
  };

  const manejarGuardado = async () => {
    await cargarClientes();
    setMostrandoFormulario(false);
    setClienteEnEdicion(null);
  };

  if (mostrandoFormulario) {
    return (
      <FormularioCliente
        cliente={clienteEnEdicion}
        onCancelar={() => { setMostrandoFormulario(false); setClienteEnEdicion(null); }}
        onGuardado={manejarGuardado}
      />
    );
  }

  return (
    <DirectorioClientes
      clientesGlobales={clientesGlobales}
      setClientesGlobales={setClientesGlobales}
      onEditar={abrirParaEditar}
    />
  );
}
