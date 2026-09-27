import { useState } from "react";
import{useAuth} from "../../context/AuthContext"

export default function Login({onExito}){
    const {login}=useAuth()
    const [form, setForm]=useState({email:'', password:''})
    const [error, setError]=useState('')
    const [cargando, setCargando]=useState(false)

    const manejarSubmit= async(e)=> {
        e.preventDefault()
        setError('')
        setCargando(true)
        try{
            const data=await login(form.email, form.password)
            if (onExito) onExito(data)
        }catch(err){
        setError('Correo o contraseña incorrectos')
        }finally{
            setCargando(false)
        }
    }

    return(
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm p-8 rounded-[2rem] border border-sky-50 shadow-xl shadow-sky-100/50">
                <h2 className="text-xl font-bold mb-6 text-slate-800 text-center">Iniciar sesión</h2>
                {error && (
                <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
                )}
                
                <form onSubmit={manejarSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Correo</label>
                        <input type="email" required
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all text-slate-700 font-medium"
                        value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Contraseña</label>
                        <input type="password" required
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all text-slate-700 font-medium"
                        value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
                    </div>

                    <button type="submit" disabled={cargando}
                    className="w-full bg-sky-500 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform shadow-lg shadow-sky-500/30"
                    >{cargando ? 'Ingresando...' : 'Ingresar'}</button>
                </form>
            </div>
        </div>
    )
}