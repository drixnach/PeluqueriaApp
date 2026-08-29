import { useState, useMemo, useEffect } from 'react';

import { obtenerPeluqueros, obtenerHorariosPeluquero } from "../../services/PeluqueroServices";
import { obtenerClientes, crearCliente } from "../../services/ClienteServices";
import { obtenerServicios } from "../../services/ServiciosServices";
import { obtenerServiciosDePeluquero } from "../../services/PeluqueroxServicioServices";
import { obtenerPeluquerias } from "../../services/PeluqueriaServices";
import { crearTurno } from "../../services/TurnoServices";

import FormDatosCliente from './FormDatosCliente';
import SelectorServicio from './SelectorServicio';
import SelectorFechaHora from './SelectorFechaHora';

export default function VistaCliente({ turnosGlobales = [], clientesGlobales = [], setClientesGlobales, cargarTurnos }) {
  const [form, setForm] = useState({
    nombre: '', apellido: '', telefono: '', correo: '', sexo: '',
    sucursal: '', servicio: '', precio: 0, peluquero: '', fecha: '', hora: ''
  });

  const [servicios, setServicios] = useState([]);
  const [peluquerosDisponibles, setPeluquerosDisponibles] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [peluquerosFiltrados, setPeluquerosFiltrados] = useState([]);
  const [horariosPeluquero, setHorariosPeluquero] = useState([]);

  useEffect(() => {
    obtenerPeluqueros()
      .then(data => setPeluquerosDisponibles(data))
      .catch(err => console.error("Error al cargar peluqueros:", err));

    obtenerServicios()
      .then(data => setServicios(data))
      .catch(err => console.error(err));

    obtenerPeluquerias()
      .then(data => setSucursales(data))
      .catch(err => console.error("Error al cargar sucursales:", err));

  }, []);

  useEffect(() => {
    async function filtrarPeluqueros() {
      if (!form.servicio || !form.sucursal) {
        setPeluquerosFiltrados([]);
        return;
      }

      const resultado = [];
      for (const peluquero of peluquerosDisponibles) {
        const trabajaEnSucursal = peluquero.nombrePeluqueria === form.sucursal;

        if (trabajaEnSucursal) {
          const serviciosDePeluquero = await obtenerServiciosDePeluquero(peluquero.peluqueroId);
          const haceServicio = serviciosDePeluquero.some(
            s => s.nombreServicio === form.servicio
          );

          if (haceServicio) {
            resultado.push(peluquero);
          }
        }
      }
      setPeluquerosFiltrados(resultado);
    }
    filtrarPeluqueros();
  }, [form.servicio, form.sucursal, peluquerosDisponibles]);

  useEffect(() => {
    async function cargarHorarios() {
      if (!form.peluquero || form.peluquero === 'Cualquiera') {
        setHorariosPeluquero([]);
        return;
      }

      const peluquero = peluquerosFiltrados.find(p => p.nombre === form.peluquero);
      if (peluquero) {
        try {
          const horarios = await obtenerHorariosPeluquero(peluquero.peluqueroId);
          setHorariosPeluquero(horarios);
        } catch (error) {
          console.error("Error al obtener horarios del peluquero:", error);
          setHorariosPeluquero([]);
        }
      }
    }
    cargarHorarios();
  }, [form.peluquero, peluquerosFiltrados]);

  const diasDisponibles = useMemo(() => {
    const dias = [];
    let fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (!form.peluquero || form.peluquero === 'Cualquiera' || horariosPeluquero.length === 0) {
      let intentos = 0;
      while (dias.length < 14 && intentos < 30) {
        const diaSemana = fechaActual.getDay();
        if (diaSemana !== 0 && diaSemana !== 1) {
          dias.push(new Date(fechaActual));
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
        intentos++;
      }
      return dias;
    }

    const diasTrabajadosSet = new Set(horariosPeluquero.map(h => h.diaSemana));
    let intentos = 0;

    while (dias.length < 14 && intentos < 60) {
      const diaSemana = fechaActual.getDay();

      if (diasTrabajadosSet.has(diaSemana)) {
        dias.push(new Date(fechaActual));
      }
      fechaActual.setDate(fechaActual.getDate() + 1);
      intentos++;
    }
    return dias;
  }, [horariosPeluquero, form.peluquero]);

  const turnosDinamicos = useMemo(() => {
    if (!form.fecha || horariosPeluquero.length === 0) return [];

    const fechaSeleccionada = new Date(`${form.fecha}T00:00:00`);
    const diaSemanaSeleccionado = fechaSeleccionada.getDay();
    const horarioDelDia = horariosPeluquero.find(h => h.diaSemana === diaSemanaSeleccionado);

    if (!horarioDelDia || !horarioDelDia.horaInicio || !horarioDelDia.horaFin) return [];

    const crearFechaBase = (horaString) => {
      const [horas, minutos] = horaString.split(':');
      const d = new Date();
      d.setHours(parseInt(horas, 10), parseInt(minutos, 10), 0, 0);
      return d;
    };

    const inicio = crearFechaBase(horarioDelDia.horaInicio);
    const fin = crearFechaBase(horarioDelDia.horaFin);
    const servicioSeleccionado = servicios.find(s => s.nombre === form.servicio);
    const duracion = servicioSeleccionado?.duracionMinutos || 30;

    const slots = [];
    let actual = new Date(inicio);

    while (actual < fin) {
      const posibleFin = new Date(actual.getTime() + duracion * 60000);
      if (posibleFin <= fin) {
        slots.push(actual.toTimeString().slice(0, 5));
      }
      actual.setMinutes(actual.getMinutes() + duracion);
    }

    return slots;
  }, [form.fecha, horariosPeluquero, form.servicio, servicios]);

  const estaDisponible = (hora) => {
    if (!form.fecha || !form.peluquero) return false;

    const servicioSeleccionado = servicios.find(s => s.nombre === form.servicio);
    const duracion = servicioSeleccionado?.duracionMinutos || 30;

    const fechaHoraInicio = new Date(`${form.fecha}T${hora}:00`);
    const fechaHoraFin = new Date(fechaHoraInicio.getTime() + duracion * 60000);

    const ocupado = turnosGlobales.some(t => {
      if (t.nombrePeluquero !== form.peluquero) return false;

      const inicioLimpio = t.fechaInicioTurno.replace('Z', '');
      const finLimpio = t.fechaFinTurno.replace('Z', '');

      const tInicio = new Date(inicioLimpio);
      const tFin = new Date(finLimpio);

      return tInicio < fechaHoraFin && tFin > fechaHoraInicio;
    });

    return !ocupado;
  };

  const manejarReserva = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.apellido || !form.telefono || !form.correo || !form.sexo ||
        !form.sucursal || !form.servicio || !form.peluquero || !form.fecha || !form.hora) {
      alert("Por favor, completá todos los pasos antes de confirmar.");
      return;
    }

    try {
      const nuevoCliente = {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        correo: form.correo,
        sexo: form.sexo
      };

      let clienteCreado;
      const clienteExiste = clientesGlobales.find(
        c => c.nombre.toLowerCase() === form.nombre.toLowerCase() &&
             c.apellido.toLowerCase() === form.apellido.toLowerCase()
      );

      if (!clienteExiste) {
        clienteCreado = await crearCliente(nuevoCliente);
        const clientesActualizados = await obtenerClientes();
        setClientesGlobales(clientesActualizados);
      } else {
        clienteCreado = clienteExiste;
      }

      const peluqueriaSeleccionada = sucursales.find(s => s.nombre === form.sucursal);
      const peluqueroSeleccionado = peluquerosFiltrados.find(p => p.nombre === form.peluquero);
      const servicioSeleccionado = servicios.find(s => s.nombre === form.servicio);

      const duracion = servicioSeleccionado.duracionMinutos || 30;
      const fechaInicio = new Date(`${form.fecha}T${form.hora}:00`);
      const fechaFin = new Date(fechaInicio.getTime() + duracion * 60000);

      const pad = (n) => n.toString().padStart(2, "0");
      const fechaInicioStr = `${fechaInicio.getFullYear()}-${pad(fechaInicio.getMonth()+1)}-${pad(fechaInicio.getDate())}T${pad(fechaInicio.getHours())}:${pad(fechaInicio.getMinutes())}:00`;
      const fechaFinStr = `${fechaFin.getFullYear()}-${pad(fechaFin.getMonth()+1)}-${pad(fechaFin.getDate())}T${pad(fechaFin.getHours())}:${pad(fechaFin.getMinutes())}:00`;

      const turno = {
        clienteId: clienteCreado.clienteId,
        peluqueroId: peluqueroSeleccionado.peluqueroId,
        peluqueriaId: peluqueriaSeleccionada.peluqueriaId,
        fechaInicioTurno: fechaInicioStr,
        fechaFinTurno: fechaFinStr,
        serviciosIds: [servicioSeleccionado.servicioId]
      };

      await crearTurno(turno);

      if (cargarTurnos) {
        await cargarTurnos();
      }

      setForm({
        nombre: '', apellido: '', telefono: '', correo: '', sexo: '',
        sucursal: '', servicio: '', precio: 0, peluquero: '', fecha: '', hora: ''
      });

      alert("¡Turno creado con éxito!");
    } catch (error) {
      console.error(error);
      alert("Error al crear turno");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 selection:bg-sky-200 relative">
      <header className="bg-white border-b border-sky-100 py-8 px-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-600"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative z-10">
          <div className="relative flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-4xl font-serif text-white italic pr-1">C</span>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-sky-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-[10px] text-white">✂️</span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Peluquería <span className="text-sky-600">Cervantes</span></h1>
            <p className="text-[10px] tracking-[0.2em] text-sky-600/70 font-bold uppercase mt-1">Reservas Online</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <section className="bg-white p-6 sm:p-8 rounded-[2rem] border border-sky-50 shadow-xl shadow-sky-100/50">
          <h2 className="text-xl font-bold mb-6 text-slate-800"><span className="text-sky-500">📅</span> Reservar un turno</h2>

          <form onSubmit={manejarReserva} className="space-y-6">
            <FormDatosCliente form={form} setForm={setForm} />

            <SelectorServicio
              form={form}
              setForm={setForm}
              sucursales={sucursales}
              servicios={servicios}
              peluquerosFiltrados={peluquerosFiltrados}
            />

            <SelectorFechaHora
              form={form}
              setForm={setForm}
              diasDisponibles={diasDisponibles}
              turnosDinamicos={turnosDinamicos}
              estaDisponible={estaDisponible}
            />

            <button type="submit" disabled={!form.nombre || !form.apellido || !form.telefono || !form.correo || !form.sexo || !form.sucursal || !form.servicio || !form.peluquero || !form.fecha || !form.hora}
              className="w-full bg-sky-500 text-white font-bold py-4 rounded-2xl mt-6 disabled:opacity-50 active:scale-[0.98] transition-transform shadow-lg shadow-sky-500/30 disabled:shadow-none cursor-pointer">
              CONFIRMAR MI TURNO
            </button>
          </form>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
