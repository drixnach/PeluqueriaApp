export type Cliente = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  sexo: string;
  correo: string;
};

export const CLIENTES: Cliente[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "3511234567",
    sexo: "Masculino",
    correo: "juan.perez@email.com",
  },
  {
    id: "2",
    nombre: "María",
    apellido: "Gómez",
    telefono: "3512345678",
    sexo: "Femenino",
    correo: "maria.gomez@email.com",
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "López",
    telefono: "3513456789",
    sexo: "Masculino",
    correo: "carlos.lopez@email.com",
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Martínez",
    telefono: "3514567890",
    sexo: "Femenino",
    correo: "ana.martinez@email.com",
  },
  {
    id: "5",
    nombre: "Sofía",
    apellido: "Rodríguez",
    telefono: "3515678901",
    sexo: "Femenino",
    correo: "sofia.rodriguez@email.com",
  },
];