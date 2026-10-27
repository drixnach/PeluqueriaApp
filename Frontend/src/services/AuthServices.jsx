import { apiFetch } from "./ApiFetch";

const URL="http://localhost:5143/api/Auth";

export async function loginRequest(email, password) {
    const response= await fetch(`${URL}/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    })

    if(!response.ok){
        throw new Error("credenciales invalidas")
    }

    return await response.json()
}

export async function registrarUsuarioPeluquero({email, password, peluqueroId}){
    const response=await apiFetch(`${URL}/register-staff`,{
        method:'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email, password, rol:"Peluquero", peluqueroId})
    })

    if (!response.ok){
        const texto= await response.text();
        throw new error( texto || "Error al crear usuario")
    }

    return await response.json()
}