export default function BarraSesion({auth, onLogin, onLogout}){
    return(
        <div className="fixed bottom-6 right-6 z-50">
            <div 
            className="bg-white/90 backdrop-blur shadow-2xl border border-slate-200 p-2 rounded-2xl flex items-center gap-3">
                {auth ? (
                    <>
                        <span className="text-sm font-bold text-slate-600 px-2">
                            {auth.nombre} <span className="text-slate-400 font-normal">{auth.rol}</span>
                        </span>
                        <button onClick={onLogout} 
                        className="px-4 py-2 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-all">
                            Cerrar Sesion
                        </button>
                    </> 
                    ) : (
                        <button onClick={onLogin} 
                        className="px-4 py-2 rounded-xl font-bold text-sm bg-sky-500 text-white hover:bg-sky-600 transition-all">
                            Iniciar Sesion
                        </button>
                    )}
            </div>
        </div>
    )
}