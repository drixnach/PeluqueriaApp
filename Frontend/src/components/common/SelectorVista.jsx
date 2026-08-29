export default function SelectorVista({ vistaActual, setVistaActual }) {
  return (
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
  );
}
