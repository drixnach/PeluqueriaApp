import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import { useAuthStore } from "@/store/authStore";


export type ClienteApi = {
    clienteId: number;
    nombre: string | null;
    apellido: string | null;
    correo: string | null;
    telefono: string | null;
    sexo: string | null;
};

export type ClienteVista = {
    id: string;
    nombre: string;
    apellido: string;
    telefono: string;
    sexo: string;
    correo: string;
};

export function aClienteVista(c: ClienteApi): ClienteVista {
    return {
        id: String(c.clienteId),
        nombre: c.nombre ?? '',
        apellido: c.apellido ?? '',
        telefono: c.telefono ?? '',
        sexo: c.sexo ?? '',
        correo: c.correo ?? '',
    };
}

export function useMiCliente(id: string | undefined) {
    const peluqueroId = useAuthStore((s) => s.user?.peluqueroId);

    return useQuery<ClienteApi, Error>({
        queryKey: ['mi-cliente', peluqueroId, id],
        enabled: !!peluqueroId && !!id,
        queryFn: async () => {
        const response = await apiFetch(`/Clientes/mis-clientes/${id}`);
        if (!response.ok) {
            throw new Error(
            response.status === 404 ? 'Cliente no encontrado' : `Error al cargar el cliente (${response.status})`
            );
        }
        return response.json();
    },
    });
}

export function useMisClientes(){
    const peluqueroId=useAuthStore((s)=>s.user?.peluqueroId)

    return useQuery<ClienteApi[], Error>({
        queryKey:['mis-clientes', peluqueroId],
        enabled:!!peluqueroId,
        queryFn:async()=>{
            const response=await apiFetch('/Clientes/mis-clientes')
            if(!response.ok) throw new Error(`Error al cargar clientes ${response.status}`)
            
            return response.json()
        }
    })
}