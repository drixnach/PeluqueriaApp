export type Turno = {
  id: string;
  clienteId: string;
  servicio: string;
  fecha: string;
  peluquero: string;
  monto: number;
};

export const TURNOS: Turno[] = [
  {
    id: "1",
    clienteId: "1",
    servicio: "Corte + Barba",
    fecha: "2026-09-20",
    peluquero: "Carlos",
    monto: 15000,
  },
  {
    id: "2",
    clienteId: "1",
    servicio: "Corte",
    fecha: "2026-09-10",
    peluquero: "Luis",
    monto: 10000,
  },
  {
    id: "3",
    clienteId: "1",
    servicio: "Color + Corte",
    fecha: "2026-08-25",
    peluquero: "Ana",
    monto: 25000,
  },
  {
    id: "4",
    clienteId: "2",
    servicio: "Peinado",
    fecha: "2026-09-18",
    peluquero: "Ana",
    monto: 12000,
  },
  {
    id: "5",
    clienteId: "2",
    servicio: "Corte + Tratamiento",
    fecha: "2026-09-05",
    peluquero: "Carlos",
    monto: 18000,
  },
  {
    id: "6",
    clienteId: "2",
    servicio: "Mechas",
    fecha: "2026-08-20",
    peluquero: "Luis",
    monto: 30000,
  },
  {
    id: "7",
    clienteId: "3",
    servicio: "Corte",
    fecha: "2026-09-22",
    peluquero: "Luis",
    monto: 10000,
  },
  {
    id: "8",
    clienteId: "3",
    servicio: "Barba",
    fecha: "2026-09-08",
    peluquero: "Carlos",
    monto: 7000,
  },
  {
    id: "9",
    clienteId: "3",
    servicio: "Corte + Barba",
    fecha: "2026-08-28",
    peluquero: "Carlos",
    monto: 15000,
  },
  {
    id: "10",
    clienteId: "4",
    servicio: "Color",
    fecha: "2026-09-15",
    peluquero: "Ana",
    monto: 20000,
  },
  {
    id: "11",
    clienteId: "4",
    servicio: "Corte",
    fecha: "2026-09-01",
    peluquero: "Luis",
    monto: 10000,
  },
  {
    id: "12",
    clienteId: "4",
    servicio: "Tratamiento Keratina",
    fecha: "2026-08-18",
    peluquero: "Carlos",
    monto: 35000,
  },
  {
    id: "13",
    clienteId: "5",
    servicio: "Peinado Evento",
    fecha: "2026-09-19",
    peluquero: "Ana",
    monto: 18000,
  },
  {
    id: "14",
    clienteId: "5",
    servicio: "Corte + Color",
    fecha: "2026-09-03",
    peluquero: "Luis",
    monto: 22000,
  },
  {
    id: "15",
    clienteId: "5",
    servicio: "Tratamiento Hidratación",
    fecha: "2026-08-22",
    peluquero: "Carlos",
    monto: 12000,
  },
];