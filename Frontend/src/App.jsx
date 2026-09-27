import { useState, useEffect } from 'react';
import { obtenerTurnos } from './services/TurnoServices';
import {AuthProvider, useAuth} from './context/AuthContext';

import VistaCliente from './components/cliente/VistaCliente';
import VistaAdmin from './components/admin/VistaAdmin';
import Login from './components/auth/Login';
import BarraSesion from './components/common/BarraSesion';

function AppContenido(){
  const {auth, cargando, logout}=useAuth()
  const [turnosGlobales, setTurnosGlobales]=useState([])
  const [clientesGlobales, setClientesGlobales]=useState([])
  const [mostrandoLogin, setMostrandoLogin]=useState(false)

  useEffect(()=>{
    cargarTurnos()
  },[])

  async function cargarTurnos() {
    try{
      const data=await obtenerTurnos()
      setTurnosGlobales(data)
    }catch(error){
      console.error('Error al cargar turnos', error)
    }
  }

  if (cargando) return null

  if (mostrandoLogin&&!auth){
    return <Login onExito={()=>setMostrandoLogin(false)}/>
  }

  return(
    <>
      <BarraSesion 
        auth={auth} 
        onLogin={()=>setMostrandoLogin(true)} 
        onLogout={logout}/>

      {auth?.rol==='Admin'?(
        <VistaAdmin 
          turnosGlobales={turnosGlobales}
          setTurnosGlobales={setTurnosGlobales}
          clientesGlobales={clientesGlobales}
          setClientesGlobales={setClientesGlobales}
          cargarTurnos={cargarTurnos}/>
          
      ):auth?.rol==='Peluquero'?(
        <div className='min-h-screen flex items-center justify-center bg-slate-50'>
          <p className='text-slate-500 font-medium'>En construccion</p>
        </div>
      ):(<VistaCliente
          turnosGlobales={turnosGlobales}
          setTurnosGlobales={setTurnosGlobales}
          clientesGlobales={clientesGlobales}
          setClientesGlobales={setClientesGlobales}
          cargarTurnos={cargarTurnos}/>
        )}
    </>
  )
}

export default function App(){
  return(
    <AuthProvider>
      <AppContenido/>
    </AuthProvider>
  )
}