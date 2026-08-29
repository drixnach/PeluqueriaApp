import { useState } from 'react';
import { editarCliente } from "../../services/ClienteServices";

export default function FormularioCliente({ cliente, onCancelar, onGuardado }) {
  const [form, setForm] = useState({
    nombre: cliente?.nombre || '',
    apellido: cliente?.apellido || '',
    telefono: cliente?.telefono || '',
    correo: cliente?.correo || '',
    sexo: cliente?.sexo || 'Femenino'
  });

  const manejarSubmitCliente = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.telefono || !form.correo || !form.sexo) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    try {
      await editarCliente(cliente.clienteId, {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        correo: form.correo,
        sexo: form.sexo
      });
      await onGuardado();
      alert("¡Cliente actualizado con éxito!");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar cliente");
    }
  };

  return (
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
          onClick={onCancelar}
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
                value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Apellido</label>
              <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Teléfono</label>
              <input type="tel" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Correo</label>
              <input type="email" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-text caret-slate-900"
                value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Sexo</label>
              <select className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-slate-700 font-medium cursor-pointer"
                value={form.sexo} onChange={e => setForm({ ...form, sexo: e.target.value })}>
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
  );
}
