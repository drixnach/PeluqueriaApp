import { useState, useEffect } from 'react';
import { obtenerTurnos } from './services/TurnoServices';

import VistaCliente from './components/cliente/VistaCliente';
import VistaAdmin from './components/admin/VistaAdmin';
import SelectorVista from './components/common/SelectorVista';

export default function App() {
  const [vistaActual, setVistaActual] = useState('cliente');
  const [turnosGlobales, setTurnosGlobales] = useState([]);
  const [clientesGlobales, setClientesGlobales] = useState([]);

  useEffect(() => {
    cargarTurnos();
  }, []);

  async function cargarTurnos() {
    try {
      const data = await obtenerTurnos();
      setTurnosGlobales(data);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
    }
  }

  return (
    <>
      <SelectorVista vistaActual={vistaActual} setVistaActual={setVistaActual} />

      {vistaActual === 'cliente' ? (
        <VistaCliente
          turnosGlobales={turnosGlobales}
          setTurnosGlobales={setTurnosGlobales}
          clientesGlobales={clientesGlobales}
          setClientesGlobales={setClientesGlobales}
          cargarTurnos={cargarTurnos}
        />
      ) : (
        <VistaAdmin
          turnosGlobales={turnosGlobales}
          setTurnosGlobales={setTurnosGlobales}
          clientesGlobales={clientesGlobales}
          setClientesGlobales={setClientesGlobales}
          cargarTurnos={cargarTurnos}
        />
      )}
    </>
  );
}
