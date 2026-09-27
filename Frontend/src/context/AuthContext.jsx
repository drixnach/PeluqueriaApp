import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest } from "../services/AuthServices";

const AuthContext=createContext(null)
const STORAGE_KEY='auth'

export function AuthProvider({children}){
    const [auth, setAuth]=useState(null)
    const [cargando, setCargando]=useState(true)

    useEffect(()=>{
        const guardado=localStorage.getItem(STORAGE_KEY)
        if(guardado){
        try{
            setAuth(JSON.parse(guardado))
        }catch{
            localStorage.removeItem(STORAGE_KEY)
        }
    }
    setCargando(false)
    },[])

    const login=async (email, password)=>{
        const data=await loginRequest(email, password)
        setAuth(data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        return data
    }

    const logout=()=>{
        setAuth(null)
        localStorage.removeItem(STORAGE_KEY)
    }

    return(
        <AuthContext.Provider value={{auth, cargando, login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context=useContext(AuthContext)
    if(!context){
        throw new Error("useAuth debe usarse dentro de authProvider")
    }

    return context
}
