export default function FormDatosCliente({ form, setForm }) {
  return (
    <>
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
    </>
  );
}
