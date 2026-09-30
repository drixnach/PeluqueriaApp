import{useMutation} from '@tanstack/react-query'
import { apiFetch } from './client'
import { useAuthStore, LoginResponse } from '@/store/authStore'

type Credentials={email:string; password:string}
const ROLES_PERMITIDOS = __DEV__ ? ['Peluquero', 'Admin'] : ['Peluquero'];

export function useLogin(){
    const setSession=useAuthStore((s)=>s.setSession)

    return useMutation<LoginResponse, Error, Credentials>({
        mutationFn:async({email,password})=>{
            const response=await apiFetch('/api/Auth/login',{
                method:'POST',
                body:JSON.stringify({email,password})
            })

            if(!response.ok){
                const bodyText = await response.text();
                console.log('Login falló:', response.status, bodyText);
                throw new Error(response.status===401?'Correo o cotraseña incorrectos':'Error del servidor')
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