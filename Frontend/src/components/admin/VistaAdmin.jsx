import { useState, useEffect } from 'react';
import { obtenerPeluqueros } from "../../services/PeluqueroServices";
import { obtenerServicios } from "../../services/ServiciosServices";
import { obtenerPeluquerias } from "../../services/PeluqueriaServices";
import { obtenerClientes } from "../../services/ClienteServices";

import SidebarAdmin from './SidebarAdmin';
import AgendaTurnos from './AgendaTurnos';
import GestionPeluqueros from './GestionPeluqueros';
import SeccionClientes from './SeccionClientes';

export default function VistaAdmin({ turnosGlobales = [], clientesGlobales = [], setClientesGlobales, cargarTurnos }) {
  const [seccionActiva, setSeccionActiva] = useState('agenda');
  const [filtroFecha, setFiltroFecha] = useState('');

  const [listaPeluqueros, setListaPeluqueros] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    cargarPeluqueros();
    cargarSucursales();
    cargarClientes();
    cargarServicios();
  }, []);

  async function cargarClientes() {
    try {
      const data = await obtenerClientes();
      setClientesGlobales(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar clientes");
    }
  }

  async function cargarPeluqueros() {
    try {
      const data = await obtenerPeluqueros();
      setListaPeluqueros(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar peluqueros");
    }
  }

  async function cargarSucursales() {
    try {
      const data = await obtenerPeluquerias();
      setSucursales(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar sucursales");
    }
  }

  async function cargarServicios() {
    try {
      const data = await obtenerServicios();
      setServicios(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar servicios");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row pb-20 md:pb-0 selection:bg-sky-200">
      <SidebarAdmin seccionActiva={seccionActiva} setSeccionActiva={setSeccionActiva} />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {seccionActiva === 'agenda' && (
          <AgendaTurnos
            turnosGlobales={turnosGlobales}
            filtroFecha={filtroFecha}
            setFiltroFecha={setFiltroFecha}
            cargarTurnos={cargarTurnos}
          />
        )}

        {seccionActiva === 'peluqueros' && (
          <GestionPeluqueros
            listaPeluqueros={listaPeluqueros}
            setListaPeluqueros={setListaPeluqueros}
            sucursales={sucursales}
            servicios={servicios}
            cargarPeluqueros={cargarPeluqueros}
          />
        )}

        {seccionActiva === 'clientes' && (
          <SeccionClientes
            clientesGlobales={clientesGlobales}
            setClientesGlobales={setClientesGlobales}
            cargarClientes={cargarClientes}
          />
        )}
      </main>
    </div>
  );
}
