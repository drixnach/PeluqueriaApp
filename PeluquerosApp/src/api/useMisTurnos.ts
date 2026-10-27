import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';
import { useAuthStore } from '@/store/authStore';

export type TurnoApi = {
    turnoId: number;
    clienteId: number | null;
    fechaInicioTurno: string;
    fechaFinTurno: string;
    nombreCliente: string | null;
    nombrePeluquero: string | null;
    nombrePeluqueria: string | null;
    servicios: { servicioId: number; nombre: string | null; precio: number }[];
};

export type TurnoVista = {
    id: string;
    clienteId: string;
    fecha: string;
    hora: string;
    peluquero: string;
    nombreCliente: string;
    servicio: string;
    monto: number;
};

export function aTurnoVista(t: TurnoApi): TurnoVista {
    return {
    id: String(t.turnoId),
    clienteId: String(t.clienteId ?? ''),
    fecha: t.fechaInicioTurno.slice(0, 10),
    hora: t.fechaInicioTurno.slice(11, 16),
    peluquero: t.nombrePeluquero ?? '',
    nombreCliente: t.nombreCliente ?? 'Cliente',
    servicio: t.servicios.map((s) => s.nombre).filter(Boolean).join(', '),
    monto: t.servicios.reduce((acc, s) => acc + s.precio, 0),
    };
}

export function useMisTurnos(desde?: string, hasta?: string) {
    const peluqueroId = useAuthStore((s) => s.user?.peluqueroId);

    return useQuery<TurnoApi[], Error>({
    queryKey: ['mis-turnos', peluqueroId, desde, hasta],
    enabled: !!peluqueroId,
    queryFn: async () => {
        const params = new URLSearchParams();
        if (desde) params.append('desde', desde);
        if (hasta) params.append('hasta', hasta);
        const qs = params.toString();

        const response = await apiFetch(`/Turno/mis-turnos${qs ? `?${qs}` : ''}`);
        if (!response.ok) throw new Error(`Error al cargar turnos (${response.status})`);
        return response.json();
        },
    });
}

export function useMiTurno(id: string | undefined) {
    const peluqueroId = useAuthStore((s) => s.user?.peluqueroId);

    return useQuery<TurnoApi, Error>({
    queryKey: ['mi-turno', peluqueroId, id],
    enabled: !!peluqueroId && !!id,
    queryFn: async () => {
        const response = await apiFetch(`/Turno/mis-turnos/${id}`);
        if (!response.ok) {
        throw new Error(
            response.status === 404 ? 'Turno no encontrado' : `Error al cargar el turno (${response.status})`
        );
        }
        return response.json();
        },
    });
}

export function useTurnosDeCliente(clienteId:string|undefined){
    const peluqueroId=useAuthStore((s)=>s.user?.peluqueroId)

    return useQuery<TurnoApi[], Error>({
        queryKey:['turnos-cliente',peluqueroId,clienteId],
        enabled:!!peluqueroId&&!!clienteId,
        queryFn:async()=>{
            const response= await apiFetch(`/Turno/mis-turnos?clienteId=${encodeURIComponent(clienteId!)}`)
            if (!response.ok) throw new Error(`Error al cargar turnos (${response.status})`)
            return response.json()
            
        }
    })
}