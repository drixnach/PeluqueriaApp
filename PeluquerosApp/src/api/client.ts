import { useAuthStore } from "@/store/authStore";

const API_URL=process.env.EXPO_PUBLIC_API_URL

// EXPO_PUBLIC_API_URL ya incluye el prefijo /api, por lo que `path` es relativo a /api
// (ej: '/Auth/login', '/Clientes').
type ApiFetchOptions = RequestInit & { skipAuth?: boolean }

export async function apiFetch(path:string, { skipAuth=false, ...options }:ApiFetchOptions={}){
    const token = skipAuth ? null : useAuthStore.getState().token

    const response=await fetch(`${API_URL}${path}`,{
        ...options,
        headers:{
            'Content-Type':'application/json',
            ...(options.headers||{}),
            ...(token?{Authorization:`Bearer ${token}`}:{}),
        },
    })

    // Solo cerramos sesión si veníamos con un token: un 401 en endpoints anónimos
    // (login) no debe disparar logout().
    if(response.status===401&&token){
        useAuthStore.getState().logout()
    }

    return(response)
}

