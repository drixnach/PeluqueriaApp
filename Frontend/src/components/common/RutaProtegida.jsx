import { Navigate } from "react-router-dom";
import {useAuth} from '../../context/AuthContext'
import { rutaPorRol } from "../../utils/rutas";

export default function RutaProtegida({roles, children}){
    const {auth, cargando}=useAuth();

    if (cargando) return null
    if(!auth) return <Navigate to='/login' replace/>
    if(!roles.includes(auth.rol)) return <Navigate to={rutaPorRol(auth.rol)} replace/>

    return children;
}