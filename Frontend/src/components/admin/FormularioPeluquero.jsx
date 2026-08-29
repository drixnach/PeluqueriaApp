import { useState } from 'react';
import {
  crearPeluquero,
  editarPeluquero,
  obtenerHorariosPeluquero,
  crearHorarioPeluquero,
  eliminarHorarioPeluquero
} from "../../services/PeluqueroServices";
import { getNombreDia } from '../../utils/formatters';

const estadoInicialPeluquero = {
  nombre: '', apellido: '', telefono: '', servicioIds: [], cuil: '', fechaContratacion: '', peluqueriaId: null,
  horarios: [],
  direccion: { calle: '', altura: '', ciudad: '', provincia: '', codigoPostal: '', pais: 'Argentina' }
};

export default function FormularioPeluquero({ peluqueroEnEdicion, sucursales, servicios, onCancelar, onGuardado }) {
  const idEnEdicion = peluqueroEnEdicion?.peluqueroId ?? null;

  const [nuevoPel, setNuevoPel] = useState(() => {
    if (!peluqueroEnEdicion) return estadoInicialPeluquero;
    return {
      nombre: peluqueroEnEdicion.nombre || '',
      apellido: peluqueroEnEdicion.apellido || '',
      telefono: peluqueroEnEdicion.telefono || '',
      servicioIds: peluqueroEnEdicion.servicioIds || [],
      cuil: peluqueroEnEdicion.cuil || '',
      fechaContratacion: peluqueroEnEdicion.fechaContratacion?.split('T')[0] || '',
      horarios: peluqueroEnEdicion.horarios || [],
      peluqueriaId: peluqueroEnEdicion.peluqueriaId,
      direccion: {
        calle: peluqueroEnEdicion.direccion?.calle || '',
        altura: peluqueroEnEdicion.direccion?.altura || '',
        ciudad: peluqueroEnEdicion.direccion?.ciudad || '',
        provincia: peluqueroEnEdicion.direccion?.provincia || '',
        codigoPostal: peluqueroEnEdicion.direccion?.codigoPostal || '',
        pais: peluqueroEnEdicion.direccion?.pais || 'Argentina'
      }
    };
  });

  const [nuevoHorario, setNuevoHorario] = useState({ diaSemana: '', horaInicio: '', horaFin: '' });

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

      if (idEnEdicion !== null) {
        await editarPeluquero(idEnEdicion, body);
        alert("¡Profesional actualizado con éxito!");
        const horariosActuales = await obtenerHorariosPeluquero(idEnEdicion);

        for (const h of body.horarios || []) {
          const existe = horariosActuales.some(
            ha => ha.diaSemana === h.diaSemana &&
                  ha.horaInicio === h.horaInicio &&
                  ha.horaFin === h.horaFin
          );
          if (!existe) {
            await crearHorarioPeluquero(idEnEdicion, h);
          }
        }

        for (const ha of horariosActuales) {
          const sigue = (body.horarios || []).some(
            h => h.diaSemana === ha.diaSemana &&
                 h.horaInicio === ha.horaInicio &&
                 h.horaFin === ha.horaFin
          );
          if (!sigue) {
            await eliminarHorarioPeluquero(idEnEdicion, ha.horarioPeluqueroId);
          }
        }
      } else {
        const peluqueroCreado = await crearPeluquero(body);
        alert("¡Profesional agregado con éxito!");

        if (body.horarios && body.horarios.length > 0) {
          for (const h of body.horarios) {
            await crearHorarioPeluquero(peluqueroCreado.peluqueroId, h);
          }
        }
      }

      await onGuardado();
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

  return (
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
          onClick={onCancelar}
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
                value={nuevoPel.servicioIds?.[0] ?? ''} onChange={e => setNuevoPel({ ...nuevoPel, servicioIds: e.target.value === '' ? [] : [parseInt(e.target.value, 10)] })}>
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
              <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                value={nuevoPel.direccion?.calle || ''} onChange={e => handleDireccionChange('calle', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Altura</label>
              <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                value={nuevoPel.direccion?.altura || ''} onChange={e => handleDireccionChange('altura', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Ciudad</label>
              <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                value={nuevoPel.direccion?.ciudad || ''} onChange={e => handleDireccionChange('ciudad', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Provincia</label>
              <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                value={nuevoPel.direccion?.provincia || ''} onChange={e => handleDireccionChange('provincia', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Código Postal</label>
              <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
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
                onChange={e => setNuevoHorario({ ...nuevoHorario, diaSemana: e.target.value })}
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
                onChange={e => setNuevoHorario({ ...nuevoHorario, horaInicio: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Hora Fin</label>
              <input
                type="time"
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-pointer caret-slate-900"
                value={nuevoHorario.horaFin}
                onChange={e => setNuevoHorario({ ...nuevoHorario, horaFin: e.target.value })}
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
  );
}
