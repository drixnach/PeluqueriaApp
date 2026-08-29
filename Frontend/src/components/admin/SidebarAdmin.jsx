export default function SidebarAdmin({ seccionActiva, setSeccionActiva }) {
  return (
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
          onClick={() => setSeccionActiva('agenda')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${seccionActiva === 'agenda' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          <span className="text-lg">📅</span> Agenda de Turnos
        </button>
        <button
          onClick={() => setSeccionActiva('peluqueros')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${seccionActiva === 'peluqueros' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          <span className="text-lg">✂️</span> Peluqueros (Staff)
        </button>
        <button
          onClick={() => setSeccionActiva('clientes')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${seccionActiva === 'clientes' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          <span className="text-lg">👥</span> Directorio Clientes
        </button>
      </nav>
    </aside>
  );
}
