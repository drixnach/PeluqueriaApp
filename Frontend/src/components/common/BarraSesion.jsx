import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { rutaPorRol } from "../../utils/rutas"

export default function BarraSesion(){
    const {auth, logout}=useAuth();
    const navigate=useNavigate();

    const cerrarSesion= ()=>{
        logout();
        navigate('/');
    }

    const tienePanel= auth && (auth.rol==='Admin' || auth.rol==='Peluquero' )

    return(
        <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white/90 backdrop-blur shadow-2xl border border-slate-200 p-2 rounded-2xl flex items-center gap-3">
            {auth ? (
                <>
                <span className="text-sm font-bold text-slate-600 px-2">
                    {auth.nombre} <span className="text-slate-400 font-normal">({auth.rol})</span>
                </span>
                {tienePanel && (
                    <Link to={rutaPorRol(auth.rol)}
                    className="px-4 py-2 rounded-xl font-bold text-sm text-sky-600 hover:bg-sky-50 transition-all">
                    Mi panel
                    </Link>
                )}
                <button onClick={cerrarSesion}
                    className="px-4 py-2 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer">
                    Cerrar sesión
                    </button>
                </>
                ) : (
                <Link to="/login"
                    className="px-4 py-2 rounded-xl font-bold text-sm bg-sky-500 text-white hover:bg-sky-600 transition-all">
                    Iniciar sesión
                </Link>
                )}
            </div>
        </div>
    )
}