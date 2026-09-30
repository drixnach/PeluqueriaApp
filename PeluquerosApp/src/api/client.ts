import { useAuthStore } from "@/store/authStore";

const API_URL=process.env.EXPO_PUBLIC_API_URL

export async function apiFetch(path:string, options:RequestInit={}){
    const token=useAuthStore.getState().token

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

