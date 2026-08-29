export default function SelectorServicio({ form, setForm, sucursales, servicios, peluquerosFiltrados }) {
  return (
    <>
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
    </>
  );
}
