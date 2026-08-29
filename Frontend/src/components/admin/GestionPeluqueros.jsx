import { useState } from 'react';
import { eliminarPeluquero as eliminarPeluqueroService } from "../../services/PeluqueroServices";
import { calcularAntiguedad } from '../../utils/formatters';
import FormularioPeluquero from './FormularioPeluquero';

export default function GestionPeluqueros({ listaPeluqueros, setListaPeluqueros, sucursales, servicios, cargarPeluqueros }) {
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [peluqueroEnEdicion, setPeluqueroEnEdicion] = useState(null);

  const abrirParaCrear = () => {
    setPeluqueroEnEdicion(null);
    setMostrandoFormulario(true);
  };

  const abrirParaEditar = (peluquero) => {
    setPeluqueroEnEdicion(peluquero);
    setMostrandoFormulario(true);
  };

  const eliminarPeluquero = async (id) => {
    if (window.confirm("¿Seguro que querés dar de baja a este peluquero?")) {
      await eliminarPeluqueroService(id);
      setListaPeluqueros(listaPeluqueros.filter(p => p.peluqueroId !== id));
    }
  };

  const manejarGuardado = async () => {
    await cargarPeluqueros();
    setMostrandoFormulario(false);
    setPeluqueroEnEdicion(null);
  };

  if (mostrandoFormulario) {
    return (
      <FormularioPeluquero
        peluqueroEnEdicion={peluqueroEnEdicion}
        sucursales={sucursales}
        servicios={servicios}
        onCancelar={() => { setMostrandoFormulario(false); setPeluqueroEnEdicion(null); }}
        onGuardado={manejarGuardado}
      />
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
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
                  <td className="p-4"><span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200">{p.servicios?.length > 0 ? p.servicios.join(", ") : " "}</span></td>
                  <td className="p-4 text-center"><p className="text-sm font-bold text-sky-600 bg-sky-50 inline-block px-3 py-1 rounded-lg">{calcularAntiguedad(p.fechaContratacion)} años</p></td>
                  <td className="p-4 text-sm font-bold text-slate-700">📍 {p.nombrePeluqueria ?? 'Sin Asignar'}</td>
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
    </div>
  );
}
