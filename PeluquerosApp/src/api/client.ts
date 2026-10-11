import { useAuthStore } from "@/store/authStore";

const API_URL=process.env.EXPO_PUBLIC_API_URL


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


    if(response.status===401&&token){
        useAuthStore.getState().logout()
    }

    return(response)
}

