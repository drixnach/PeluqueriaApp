import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from 'expo-secure-store'

export type User = {
    rol: string;
    nombre: string | null;
    clienteId: number | null;
    peluqueroId: number | null;
};

export type LoginResponse = User & { token: string };

type AuthState = {
    token: string | null;
    user: User | null;
    hasHydrated: boolean;
    setSession: (data: LoginResponse) => void;
    logout: () => void;
    setHasHydrated: (value: boolean) => void;
};

const secureStorage = {
    getItem: (name: string) => SecureStore.getItemAsync(name),
    setItem:(name:string,value:string)=> SecureStore.setItemAsync(name,value),
    removeItem:(name:string)=>SecureStore.deleteItemAsync(name),
};

export const useAuthStore= create<AuthState>()(persist(
    (set)=>({
        token:null,
        user:null,
        hasHydrated:false,
        setSession:({token,...user})=>set({token,user}),
        logout:()=>set({token:null, user:null}),
        setHasHydrated:(value)=>set({hasHydrated:value}),
    }),
    {
        name:'auth',
        storage:createJSONStorage(()=>secureStorage),
        partialize:(state)=>({token:state.token,user:state.user}),
        onRehydrateStorage:()=>(state)=>state?.setHasHydrated(true),
    }
    )
)
