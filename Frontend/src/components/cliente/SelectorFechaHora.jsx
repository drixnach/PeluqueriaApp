export default function SelectorFechaHora({ form, setForm, diasDisponibles, turnosDinamicos, estaDisponible }) {
  if (!form.peluquero) return null;

  return (
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
  );
}
