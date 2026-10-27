import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Foto = {
  id: string;
  uri: string;
  createdAt: number;
};

type GaleriaState = {
  fotos: Foto[];
  agregarFoto: (uri: string) => void;
  limpiar: () => void;
};

export const useGaleriaStore = create<GaleriaState>()(
  persist(
    (set) => ({
      fotos: [],
      agregarFoto: (uri: string) =>
        set((state) => ({
          fotos: [
            { id: Date.now().toString() + Math.random().toString(36).slice(2, 9), uri, createdAt: Date.now() },
            ...state.fotos,
          ],
        })),
      limpiar: () => set({ fotos: [] }),
    }),
    {
      name: "galeria-fotos",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ fotos: state.fotos }),
    }
  )
);
