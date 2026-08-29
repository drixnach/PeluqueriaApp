import { eliminarCliente as eliminarClienteService } from "../../services/ClienteServices";
import { formatearSexo } from '../../utils/formatters';

export default function DirectorioClientes({ clientesGlobales, setClientesGlobales, onEditar }) {
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

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
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
                      <button onClick={() => onEditar(c)} className="p-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors border border-transparent hover:border-sky-200 cursor-pointer" title="Editar cliente">✏️</button>
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
    </div>
  );
}
