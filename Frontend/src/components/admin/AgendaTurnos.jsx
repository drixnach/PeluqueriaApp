import { eliminarTurno as eliminarTurnoService } from "../../services/TurnoServices";

export default function AgendaTurnos({ turnosGlobales, filtroFecha, setFiltroFecha, cargarTurnos }) {
  const turnosFiltrados = filtroFecha
    ? turnosGlobales.filter(t => {
        if (!t.fechaInicioTurno) return false;
        const fechaDelTurno = t.fechaInicioTurno.split('T')[0];
        return fechaDelTurno === filtroFecha;
      })
    : turnosGlobales;

  const eliminarTurno = async (id) => {
    if (window.confirm("¿Seguro que querés cancelar este turno?")) {
      try {
        await eliminarTurnoService(id);
        if (cargarTurnos) {
          await cargarTurnos();
        }
      } catch (error) {
        console.error(error);
        alert("Error al cancelar el turno");
      }
    }
  };

  return (
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
              const hora = fecha.toTimeString().substring(0, 5);
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
  );
}
