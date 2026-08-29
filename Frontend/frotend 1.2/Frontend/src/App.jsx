import { useState, useMemo, useEffect } from 'react';
import {
  obtenerPeluqueros,
  crearPeluquero,
  editarPeluquero,
  eliminarPeluquero as eliminarPeluqueroService,
  obtenerHorariosPeluquero,
  crearHorarioPeluquero,
  eliminarHorarioPeluquero
} from "./services/PeluqueroServices";

import {
  obtenerClientes,
  crearCliente,
  editarCliente,
  eliminarCliente as eliminarClienteService
} from "./services/ClienteServices";

import { obtenerServicios } from "./services/ServiciosServices";
import { obtenerServiciosDePeluquero } from "./services/PeluqueroxServicioServices";
import { obtenerPeluquerias } from "./services/PeluqueriaServices";

import {
  obtenerTurnos,
  crearTurno,
  eliminarTurno as eliminarTurnoService
} from "./services/TurnoServices";


// ==========================================
// 1. VISTA CLIENTE
// ==========================================
export function VistaCliente({ turnosGlobales = [], setTurnosGlobales, clientesGlobales = [], setClientesGlobales, cargarTurnos }) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Nombre</label>
                <input
                  type="text" required placeholder="Ej. Juan"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                  value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Apellido</label>
                <input
                  type="text" required placeholder="Ej. Pérez"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                  value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Teléfono de contacto</label>
              <input
                type="tel" required placeholder="Ej. 351 1234567"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Correo Electrónico</label>
                <input
                  type="email" required placeholder="Ej. juan@mail.com"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                  value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Sexo</label>
                <select
                  required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none text-slate-700 font-medium cursor-pointer"
                  value={form.sexo}
                  onChange={e => setForm({ ...form, sexo: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Peluquería (Sucursal)</label>
                <select
                  required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none text-slate-700 font-medium cursor-pointer"
                  value={form.sucursal}
                  onChange={e => setForm({ ...form, sucursal: e.target.value, peluquero: '', fecha: '', hora: '' })}
                >
                  <option value="">Seleccionar sucursal...</option>
                  {sucursales.map(s => (
                    <option key={s.peluqueriaId} value={s.nombre}>{s.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Servicio</label>
                <select
                  required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none text-slate-700 font-medium cursor-pointer"
                  value={form.servicio}
                  onChange={e => {
                    const serv = servicios.find(s => s.nombre === e.target.value);
                    setForm({ ...form, servicio: e.target.value, precio: serv ? serv.precio : 0, peluquero: '', fecha: '', hora: '' });
                  }}
                >
                  <option value="">Seleccionar...</option>
                  {servicios.map(s => (
                    <option key={s.servicioId} value={s.nombre}>
                      {s.nombre} — ${s.precio.toLocaleString('es-AR')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {form.servicio && form.sucursal && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Profesional</label>
                <select
                  required
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none text-slate-700 font-medium cursor-pointer"
                  value={form.peluquero}
                  onChange={e => setForm({ ...form, peluquero: e.target.value, fecha: '', hora: '' })}
                >
                  <option value="">Seleccionar profesional...</option>
                  <option value="Cualquiera">Cualquiera</option>
                  {peluquerosFiltrados.map(p => (
                    <option key={p.peluqueroId} value={p.nombre}>{p.nombre} {p.apellido}</option>
                  ))}
                </select>
              </div>
            )}

            {form.peluquero && (
              <div className="border-t border-slate-100 pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 block tracking-wider">1. Elegí el día</label>
                
                {diasDisponibles.length > 0 ? (
                  <div className="flex overflow-x-auto gap-3 pb-4 snap-x hide-scrollbar">
                    {diasDisponibles.map((dia, i) => {
                      const fechaStr = dia.toISOString().split('T')[0];
                      const isSelected = form.fecha === fechaStr;
                      return (
                        <button key={i} type="button" onClick={() => setForm({ ...form, fecha: fechaStr, hora: '' })}
                          className={`snap-start flex-shrink-0 flex flex-col items-center justify-center w-[4.5rem] h-24 rounded-2xl border-2 transition-all duration-300 ${isSelected ? 'bg-sky-500 border-sky-500 shadow-lg shadow-sky-200 scale-105' : 'bg-white border-slate-100 hover:border-sky-300 hover:bg-sky-50'}`}
                        >
                          <span className={`text-[11px] uppercase font-bold mb-1 ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>{dia.toLocaleDateString('es-AR', { weekday: 'short' })}</span>
                          <span className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-slate-700'}`}>{dia.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">Este profesional no tiene horarios cargados.</p>
                )}

                {form.fecha && turnosDinamicos.length > 0 && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-3 block tracking-wider">2. Elegí la hora</label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {turnosDinamicos.map(hora => {
                        const disp = estaDisponible(hora);
                        return (
                          <button key={hora} type="button" disabled={!disp} onClick={() => setForm({ ...form, hora })}
                            className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${!disp ? 'bg-slate-50 border-slate-100 text-slate-300 line-through cursor-not-allowed' : form.hora === hora ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 cursor-pointer'}`}
                          >
                            {hora}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {form.fecha && turnosDinamicos.length === 0 && (
                  <p className="text-sm text-red-500 mt-4 bg-red-50 p-3 rounded-lg border border-red-100">No hay horarios disponibles para el día seleccionado.</p>
                )}
              </div>
            )}

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

// ==========================================
// 2. VISTA ADMIN
// ==========================================
export function VistaAdmin({ turnosGlobales = [], setTurnosGlobales, clientesGlobales = [], setClientesGlobales, cargarTurnos }) {
  const [seccionActiva, setSeccionActiva] = useState('agenda');
  const [filtroFecha, setFiltroFecha] = useState('');
  
  const [listaPeluqueros, setListaPeluqueros] = useState([]);
  const [serviciosPorPeluquero, setServiciosPorPeluquero] = useState({});
  const [sucursales, setSucursales] = useState([]);
  const [servicios, setServicios] = useState([]); 
  
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [idEnEdicion, setIdEnEdicion] = useState(null);
  const [mostrandoFormularioCliente, setMostrandoFormularioCliente] = useState(false);
  const [idClienteEnEdicion, setIdClienteEnEdicion] = useState(null);

  const [nuevoHorario, setNuevoHorario] = useState({
    diaSemana: '',
    horaInicio: '',
    horaFin: ''
  });

  const estadoInicialPeluquero = {
    nombre: '', apellido: '', telefono: '', servicioIds:[], cuil: '', fechaContratacion: '', peluqueriaId: null,
    horarios: [], 
    direccion: { calle: '', altura: '', ciudad: '', provincia: '', codigoPostal: '', pais: 'Argentina' }
  };
  const [nuevoPel, setNuevoPel] = useState(estadoInicialPeluquero);


  const turnosFiltrados = filtroFecha
    ? turnosGlobales.filter(t => {
        
        if (!t.fechaInicioTurno) return false;
        const fechaDelTurno = t.fechaInicioTurno.split('T')[0];
        return fechaDelTurno === filtroFecha;
      })
    : turnosGlobales;

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

      const mapaServicios = {};
      for (const peluquero of data) {
        const serviciosDeEstePeluquero = await obtenerServiciosDePeluquero(peluquero.peluqueroId);
        mapaServicios[peluquero.peluqueroId] = serviciosDeEstePeluquero;
      }
      setServiciosPorPeluquero(mapaServicios);
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

  const formatearSexo = (sexo) => {
    if (!sexo) return '-';
    switch(sexo.toLowerCase()) {
      case 'femenino': return 'Fem';
      case 'masculino': return 'Masc';
      default: return 'Otro';
    }
  };

  const eliminarTurno = async (id) => {
    if (window.confirm("¿Seguro que querés cancelar este turno?")) {
      try {
        await eliminarTurnoService(id);
        if(cargarTurnos) {
          await cargarTurnos();
        }
      } catch (error) {
        console.error(error);
        alert("Error al cancelar el turno");
      }
    }
  };

  const calcularAntiguedad = (fechaStr) => {
    if (!fechaStr) return 0;
    const hoy = new Date();
    const fechaContratacion = new Date(fechaStr);
    let antiguedad = hoy.getFullYear() - fechaContratacion.getFullYear();
    const m = hoy.getMonth() - fechaContratacion.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaContratacion.getDate())) {
      antiguedad--;
    }
    return antiguedad;
  };

  const eliminarPeluquero = async (id) => {
    if (window.confirm("¿Seguro que querés dar de baja a este peluquero?")) {
      await eliminarPeluqueroService(id);
      setListaPeluqueros(listaPeluqueros.filter(p => p.peluqueroId !== id));
    }
  };

  const abrirParaCrear = () => {
    setNuevoPel(estadoInicialPeluquero);
    setNuevoHorario({ diaSemana: '', horaInicio: '', horaFin: '' });
    setIdEnEdicion(null);
    setMostrandoFormulario(true);
  };

  const abrirParaEditar = (peluquero) => {
    setNuevoPel({
      nombre: peluquero.nombre || '',
      apellido: peluquero.apellido || '',
      telefono: peluquero.telefono || '',
      servicioIds: peluquero.servicioIds || [],
      localAsignado: peluquero.localAsignado || '',
      cuil: peluquero.cuil || '',
      fechaContratacion: peluquero.fechaContratacion?.split('T')[0] || '',
      horarios: peluquero.horarios || [],
      peluqueriaId: peluquero.peluqueriaId,
      direccion: {
        calle: peluquero.direccion?.calle || '',
        altura: peluquero.direccion?.altura || '',
        ciudad: peluquero.direccion?.ciudad || '',
        provincia: peluquero.direccion?.provincia || '',
        codigoPostal: peluquero.direccion?.codigoPostal || '',
        pais: peluquero.direccion?.pais || 'Argentina'
      }
    });
    setIdEnEdicion(peluquero.peluqueroId);
    setMostrandoFormulario(true);
  };

  const manejarSubmitPeluquero = async (e) => {
    e.preventDefault();
    try {
      let body = { ...nuevoPel };

      if (body.horarios) {
        body.horarios = body.horarios.filter(h =>
          h.diaSemana && h.horaInicio && h.horaFin
        );
        if (body.horarios.length === 0) delete body.horarios;
      }

      const dir = body.direccion;
      if (dir && !dir.calle && !dir.altura && !dir.ciudad && !dir.provincia && !dir.codigoPostal && !dir.pais) {
        delete body.direccion;
        body.direccionId = null;
      }

      if (!body.peluqueriaId) {
        alert("Debe seleccionar una peluquería válida");
        return;
      }

      let peluqueroCreado;
      if (idEnEdicion !== null) {
        peluqueroCreado=await editarPeluquero(idEnEdicion, body);   
        alert("¡Profesional actualizado con éxito!");
        const horariosActuales=await obtenerHorariosPeluquero(idEnEdicion);

        for(const h of body.horarios||[]){
          const existe=horariosActuales.some(
            ha=>ha.diaSemana===h.diaSemana&&
            ha.horaInicio===h.horaInicio&&
            ha.horaFin===h.horaFin
          );
          if(!existe){
            await crearHorarioPeluquero(idEnEdicion,h);
          }
        }

        for(const ha of horariosActuales){
          const sigue=(body.horarios||[]).some(
            h=>h.diaSemana===ha.diaSemana&&
            h.horaInicio===ha.horaInicio&&
            h.horaFin===ha.horaFin
          );
          if(!sigue){
            await eliminarHorarioPeluquero(idEnEdicion,ha.horarioPeluqueroId);
          }
        }

      } else {
        peluqueroCreado=await crearPeluquero(body);                
        alert("¡Profesional agregado con éxito!");

        if (body.horarios && body.horarios.length > 0) {
          for (const h of body.horarios) {
            await crearHorarioPeluquero(peluqueroCreado.peluqueroId, h);
          }
        }
      }

      await cargarPeluqueros();
      setNuevoPel(estadoInicialPeluquero);
      setMostrandoFormulario(false);
      setIdEnEdicion(null);
    } catch (error) {
      console.error(error);
      alert("Error al guardar peluquero");
    }
  };

  const handleDireccionChange = (campo, valor) => {
    setNuevoPel({
      ...nuevoPel,
      direccion: { ...nuevoPel.direccion, [campo]: valor }
    });
  };

  const agregarHorarioLocal = () => {
    if (!nuevoHorario.diaSemana || !nuevoHorario.horaInicio || !nuevoHorario.horaFin) {
      alert("Por favor, completá el día, la hora de inicio y la hora de fin para agregar el horario.");
      return;
    }

    const horaInicio = nuevoHorario.horaInicio.length === 5 
      ? nuevoHorario.horaInicio + ":00" 
      : nuevoHorario.horaInicio;

    const horaFin = nuevoHorario.horaFin.length === 5 
      ? nuevoHorario.horaFin + ":00" 
      : nuevoHorario.horaFin;
      
    setNuevoPel({
      ...nuevoPel,
      horarios: [...(nuevoPel.horarios || []), {
        diaSemana: parseInt(nuevoHorario.diaSemana),
        horaInicio: horaInicio,
        horaFin: horaFin
      }]
    });

    setNuevoHorario({ diaSemana: '', horaInicio: '', horaFin: '' });
  };

  const eliminarHorarioLocal = (index) => {
    const horariosActualizados = [...nuevoPel.horarios];
    horariosActualizados.splice(index, 1);
    setNuevoPel({ ...nuevoPel, horarios: horariosActualizados });
  };

  const getNombreDia = (numeroDia) => {
    const dias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[numeroDia] || "Desconocido";
  };

  const eliminarCliente = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar a este cliente del directorio?")) {
      try {
        await eliminarClienteService(id);
        setClientesGlobales(
          clientesGlobales.filter(c => c.clienteId !== id)
        );
      } catch (error) {
        console.error(error);
        alert("Error al eliminar cliente");
      }
    }
  };

  const abrirParaEditarCliente = (cliente) => {
    setNuevoPel({ 
      nombre: cliente.nombre || '', 
      apellido: cliente.apellido || '', 
      telefono: cliente.telefono || '',
      correo: cliente.correo || '',
      sexo: cliente.sexo || ''
    });
    setIdClienteEnEdicion(cliente.clienteId);
    setMostrandoFormularioCliente(true);
  };

  const manejarSubmitCliente = async (e) => {
    e.preventDefault();
    if (!nuevoPel.nombre || !nuevoPel.apellido || !nuevoPel.telefono || !nuevoPel.correo || !nuevoPel.sexo) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    try {
      await editarCliente(idClienteEnEdicion, {
        nombre: nuevoPel.nombre,
        apellido: nuevoPel.apellido,
        telefono: nuevoPel.telefono,
        correo: nuevoPel.correo,
        sexo: nuevoPel.sexo
      });
      await cargarClientes();
      setMostrandoFormularioCliente(false);
      setIdClienteEnEdicion(null);
      alert("¡Cliente actualizado con éxito!");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar cliente");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row pb-20 md:pb-0 selection:bg-sky-200">

      <aside className="w-full md:w-72 bg-slate-900 text-slate-100 flex flex-col shadow-2xl relative overflow-hidden z-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-600"></div>
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-sky-500/10 rounded-full blur-3xl"></div>

        <div className="p-8 text-center border-b border-slate-800/50 flex flex-col items-center relative z-10">
          <div className="mb-4 relative flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl shadow-lg border border-slate-700 rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-4xl font-serif text-white italic pr-1">C</span>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-sky-500 rounded-full border-[3px] border-slate-900 flex items-center justify-center">
              <span className="text-[10px] text-white">👑</span>
            </div>
          </div>
          <h1 className="text-xl font-black tracking-widest text-sky-400 uppercase">Panel <span className="text-white">Admin</span></h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
          <button
            onClick={() => { setSeccionActiva('agenda'); setMostrandoFormulario(false); setMostrandoFormularioCliente(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${seccionActiva === 'agenda' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <span className="text-lg">📅</span> Agenda de Turnos
          </button>
          <button
            onClick={() => { setSeccionActiva('peluqueros'); setMostrandoFormularioCliente(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${seccionActiva === 'peluqueros' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <span className="text-lg">✂️</span> Peluqueros (Staff)
          </button>
          <button
            onClick={() => { setSeccionActiva('clientes'); setMostrandoFormulario(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${seccionActiva === 'clientes' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <span className="text-lg">👥</span> Directorio Clientes
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">

        {seccionActiva === 'agenda' && (
          <div className="animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {filtroFecha ? 'Turnos del día' : 'Turnos Totales'}
                  </p>
                  <p className="text-4xl font-black text-slate-800 mt-1">{turnosFiltrados.length}</p>
                </div>
                <div className="text-4xl bg-slate-100 text-slate-600 p-4 rounded-2xl">💈</div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 shadow-slate-200/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span> Agenda Activa
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto bg-slate-50 p-2 sm:p-1.5 rounded-2xl sm:rounded-full border border-slate-200">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 hidden sm:block">Filtrar por día:</label>
                  <div className="flex w-full sm:w-auto gap-2">
                    <input
                      type="date"
                      value={filtroFecha}
                      onChange={e => setFiltroFecha(e.target.value)}
                      className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 rounded-xl sm:rounded-full focus:ring-2 focus:ring-sky-400 outline-none text-sm font-bold text-slate-700 transition-all cursor-pointer caret-slate-900"
                    />
                    {filtroFecha && (
                      <button
                        onClick={() => setFiltroFecha('')}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl sm:rounded-full transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {turnosFiltrados.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="text-4xl mb-3 opacity-40">📭</div>
                  <p className="text-slate-500 font-medium text-lg">No hay turnos para {filtroFecha ? 'esta fecha' : 'mostrar'}.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {turnosFiltrados.sort((a, b) => a.fechaInicioTurno.localeCompare(b.fechaInicioTurno)).map(t => {
                    const fecha = new Date(t.fechaInicioTurno);
                    const dia = fecha.getDate();
                    const mes = fecha.getMonth() + 1;
                    const hora = fecha.toTimeString().substring(0,5);
                    const idParaBorrar = t.turnoId || t.id;

                    return (
                      <div key={idParaBorrar} className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md hover:shadow-sky-100 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500"></div>
                        <div className="pl-4">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-slate-800 text-xl">{t.nombreCliente}</h3>
                            {t.servicios.length > 0 && (
                            <span className="bg-sky-100 text-sky-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                              ${t.servicios.reduce((acc, s) => acc + s.precio, 0).toLocaleString('es-AR')}
                            </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 flex flex-wrap items-center gap-x-5 mt-2 font-medium">
                            {t.nombrePeluqueria && <span className="flex items-center gap-1.5">📍 {t.nombrePeluqueria}</span>}
                            <span className="flex items-center gap-1.5">👤 {t.nombrePeluquero}</span>
                            {t.servicios.map(s => (
                              <span key={s.servicioId} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 flex items-center gap-1.5">
                                ✂️ {s.nombre} (${s.precio})
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pl-4 md:pl-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                          <div className="text-left md:text-right">
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">Fecha / Hora</p>
                            <p className="font-bold text-sky-800 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100">
                              {dia}/{mes} a las {hora}hs
                            </p>
                          </div>
                          <button onClick={() => eliminarTurno(idParaBorrar)} className="text-red-400 hover:bg-red-50 hover:text-red-600 p-3 rounded-xl transition-all border border-transparent hover:border-red-200 cursor-pointer">
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {seccionActiva === 'peluqueros' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {!mostrandoFormulario ? (
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 shadow-slate-200/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span> Gestión de Staff
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Administrá a los profesionales y sus sucursales.</p>
                  </div>
                  <button
                    onClick={abrirParaCrear}
                    className="bg-slate-900 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>➕</span> Agregar Peluquero
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Profesional</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Contacto</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Especialidad</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Antigüedad</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Sucursal</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {listaPeluqueros.map(p => (
                        <tr key={p.peluqueroId} className="hover:bg-sky-50/50 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border border-white shadow-sm">
                                {p.nombre?.charAt(0)}{p.apellido?.charAt(0)}
                              </div>
                              <p className="font-bold text-slate-800">{p.nombre} {p.apellido}</p>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-medium text-slate-600">{p.telefono}</td>
                          <td className="p-4"><span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200">{p.servicios?.length>0?p.servicios.join(", ") : " "}</span></td>
                          <td className="p-4 text-center"><p className="text-sm font-bold text-sky-600 bg-sky-50 inline-block px-3 py-1 rounded-lg">{calcularAntiguedad(p.fechaContratacion)} años</p></td>
                          <td className="p-4 text-sm font-bold text-slate-700">📍 {p.nombrePeluqueria??'Sin Asignar'}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => abrirParaEditar(p)} className="p-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors border border-transparent hover:border-sky-200 cursor-pointer">✏️</button>
                              <button onClick={() => eliminarPeluquero(p.peluqueroId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {listaPeluqueros.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-10 text-center text-slate-500 font-medium">
                            No hay peluqueros registrados en el sistema.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 shadow-slate-200/50 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      {idEnEdicion ? 'Editar Profesional' : 'Alta de Profesional'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      {idEnEdicion ? 'Modificá los datos del peluquero.' : 'Completá todos los datos para registrar un nuevo integrante al staff.'}
                    </p>
                  </div>
                  <button
                    onClick={() => { setMostrandoFormulario(false); setIdEnEdicion(null); }}
                    className="text-slate-500 hover:text-slate-800 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    ✕ Cancelar
                  </button>
                </div>

                <form onSubmit={manejarSubmitPeluquero} className="space-y-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-4">1. Datos Personales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nombre</label>
                        <input type="text" required className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.nombre} onChange={e => setNuevoPel({ ...nuevoPel, nombre: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Apellido</label>
                        <input type="text" required className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.apellido} onChange={e => setNuevoPel({ ...nuevoPel, apellido: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">CUIL</label>
                        <input type="text" placeholder="Ej. 20-12345678-9" required className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.cuil} onChange={e => setNuevoPel({ ...nuevoPel, cuil: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Teléfono</label>
                        <input type="tel" required className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.telefono} onChange={e => setNuevoPel({ ...nuevoPel, telefono: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-4">2. Datos Laborales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Servicio Principal</label>
                        <select required className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-pointer"
                          value={nuevoPel.servicioIds?.[0] ?? ''} onChange={e => setNuevoPel({ ...nuevoPel, servicioIds:e.target.value===''?[]:[parseInt(e.target.value,10)] })}>
                          <option value="">Seleccionar servicio...</option>
                          {servicios.map(s => <option key={s.servicioId} value={s.servicioId}>{s.nombre}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Local Asignado</label>
                        <select required className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-pointer"
                          value={nuevoPel.peluqueriaId ?? ''}  
                          onChange={(e) =>
                            setNuevoPel({
                              ...nuevoPel,
                              peluqueriaId: parseInt(e.target.value)  
                            })
                          }
                        >
                          <option value="">Seleccionar...</option>
                          {sucursales.map(s => (
                            <option key={s.peluqueriaId || s} value={s.peluqueriaId}>{s.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Fecha de Contratación</label>
                        <input type="date" required className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-pointer caret-slate-900"
                          value={nuevoPel.fechaContratacion} onChange={e => setNuevoPel({ ...nuevoPel, fechaContratacion: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-4">3. Domicilio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Calle</label>
                        <input type="text"  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.direccion?.calle || ''} onChange={e => handleDireccionChange('calle', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Altura</label>
                        <input type="text"  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.direccion?.altura || ''} onChange={e => handleDireccionChange('altura', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Ciudad</label>
                        <input type="text"  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.direccion?.ciudad || ''} onChange={e => handleDireccionChange('ciudad', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Provincia</label>
                        <input type="text"  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.direccion?.provincia || ''} onChange={e => handleDireccionChange('provincia', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Código Postal</label>
                        <input type="text"  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.direccion?.codigoPostal || ''} onChange={e => handleDireccionChange('codigoPostal', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-4">4. Horarios Laborales</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end mb-6">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Día</label>
                        <select 
                          className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-pointer"
                          value={nuevoHorario.diaSemana}
                          onChange={e => setNuevoHorario({...nuevoHorario, diaSemana: e.target.value})}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="2">Martes</option>
                          <option value="3">Miércoles</option>
                          <option value="4">Jueves</option>
                          <option value="5">Viernes</option>
                          <option value="6">Sábado</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Hora Inicio</label>
                        <input 
                          type="time" 
                          className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-pointer caret-slate-900"
                          value={nuevoHorario.horaInicio}
                          onChange={e => setNuevoHorario({...nuevoHorario, horaInicio: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Hora Fin</label>
                        <input 
                          type="time" 
                          className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-pointer caret-slate-900"
                          value={nuevoHorario.horaFin}
                          onChange={e => setNuevoHorario({...nuevoHorario, horaFin: e.target.value})}
                        />
                      </div>
                      <div>
                        <button 
                          type="button" 
                          onClick={agregarHorarioLocal}
                          className="w-full bg-slate-900 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>➕</span> Agregar
                        </button>
                      </div>
                    </div>

                    {nuevoPel.horarios && nuevoPel.horarios.length > 0 ? (
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase block border-b border-slate-200 pb-2 mb-3">Horarios Asignados</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {nuevoPel.horarios.map((h, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-sky-300">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold border border-sky-100">
                                  {getNombreDia(h.diaSemana).charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">{getNombreDia(h.diaSemana)}</p>
                                  <p className="text-xs font-medium text-slate-500">{h.horaInicio}hs a {h.horaFin}hs</p>
                                </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => eliminarHorarioLocal(index)}
                                className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                                title="Eliminar horario"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-white rounded-xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium text-sm">No hay horarios agregados todavía.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sky-500/30 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      {idEnEdicion ? 'ACTUALIZAR PROFESIONAL' : 'GUARDAR PROFESIONAL'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* --- SECCIÓN CLIENTES --- */}
        {seccionActiva === 'clientes' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {!mostrandoFormularioCliente ? (
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 shadow-slate-200/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span> Directorio de Clientes
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Historial de clientes registrados automáticamente.</p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Teléfono</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Correo</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Sexo</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clientesGlobales.map(c => (
                        <tr key={c.clienteId} className="hover:bg-sky-50/50 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold border border-white shadow-sm">
                                {c.nombre.charAt(0)}{c.apellido.charAt(0)}
                              </div>
                              <p className="font-bold text-slate-800">{c.nombre} {c.apellido}</p>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-medium text-slate-600">{c.telefono}</td>
                          <td className="p-4 text-sm font-medium text-slate-600">{c.correo}</td>
                          <td className="p-4 text-center">
                            <span className="font-bold text-sky-600">{formatearSexo(c.sexo)}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => abrirParaEditarCliente(c)} className="p-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors border border-transparent hover:border-sky-200 cursor-pointer" title="Editar cliente">✏️</button>
                              <button onClick={() => eliminarCliente(c.clienteId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer" title="Eliminar cliente">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {clientesGlobales.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-10 text-center text-slate-500 font-medium">
                            Todavía no hay clientes registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 shadow-slate-200/50 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span> Editar Cliente
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      Corregí los datos de contacto del cliente.
                    </p>
                  </div>
                  <button
                    onClick={() => { setMostrandoFormularioCliente(false); setIdClienteEnEdicion(null); }}
                    className="text-slate-500 hover:text-slate-800 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    ✕ Cancelar
                  </button>
                </div>

                <form onSubmit={manejarSubmitCliente} className="space-y-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-4">1. Datos Personales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nombre</label>
                        <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.nombre} onChange={e => setNuevoPel({ ...nuevoPel, nombre: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Apellido</label>
                        <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.apellido} onChange={e => setNuevoPel({ ...nuevoPel, apellido: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Teléfono</label>
                        <input type="tel" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.telefono} onChange={e => setNuevoPel({ ...nuevoPel, telefono: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Correo</label>
                        <input type="email" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                          value={nuevoPel.correo} onChange={e => setNuevoPel({ ...nuevoPel, correo: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Sexo</label>
                        <select className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-pointer"
                          value={nuevoPel.sexo} onChange={e => setNuevoPel({ ...nuevoPel, sexo: e.target.value })}>
                          <option value="Femenino">Femenino</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sky-500/30 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      ACTUALIZAR CLIENTE
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// 3. COMPONENTE APP
// ==========================================
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
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white/90 backdrop-blur shadow-2xl border border-slate-200 p-2 rounded-2xl flex gap-2">
          <button
            onClick={() => setVistaActual('cliente')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${vistaActual === 'cliente' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            📱 Vista Cliente
          </button>
          <button
            onClick={() => setVistaActual('admin')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${vistaActual === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            💻 Vista Admin
          </button>
        </div>
      </div>

      {vistaActual === 'cliente' ? (
        <VistaCliente turnosGlobales={turnosGlobales} setTurnosGlobales={setTurnosGlobales} clientesGlobales={clientesGlobales} setClientesGlobales={setClientesGlobales} cargarTurnos={cargarTurnos} />
      ) : (
        <VistaAdmin turnosGlobales={turnosGlobales} setTurnosGlobales={setTurnosGlobales} clientesGlobales={clientesGlobales} setClientesGlobales={setClientesGlobales} cargarTurnos={cargarTurnos} />
      )}
    </>
  );
}