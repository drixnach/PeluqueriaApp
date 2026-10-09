import{useMutation} from '@tanstack/react-query'
import { apiFetch } from './client'
import { useAuthStore, LoginResponse } from '@/store/authStore'

type Credentials={email:string; password:string}
const ROLES_PERMITIDOS = __DEV__ ? ['Peluquero', 'Admin'] : ['Peluquero'];

export function useLogin(){
    const setSession=useAuthStore((s)=>s.setSession)

    return useMutation<LoginResponse, Error, Credentials>({
        mutationFn:async({email,password})=>{
            const response=await apiFetch('/Auth/login',{
                method:'POST',
                skipAuth:true,
                body:JSON.stringify({email,password})
            })

            if(!response.ok){
                const bodyText = await response.text();
                console.log('Login falló:', response.status, bodyText);
                // Preferimos el mensaje del servidor; el fallback solo aplica si vino vacío
                // (ej: 401 del middleware por ruta inválida, que no es un problema de credenciales).
                const mensaje = bodyText
                    || (response.status===401 ? 'Correo o contraseña incorrectos' : 'Error del servidor');
                throw new Error(mensaje)
            }

            const data:LoginResponse=await response.json()

            if (!ROLES_PERMITIDOS.includes(data.rol)){
                throw new Error('Acceso invalido')
            }


            return data
        },

        onSuccess:(data)=> setSession(data),
    })
}