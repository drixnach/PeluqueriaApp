const formatoMes = new Intl.DateTimeFormat('es-AR', {
  month: 'long',
  year: 'numeric',
});

const formatoDia = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export const INICIALES_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function normalizarDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}


export function claveDia(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export function sumarDias(fecha: Date, dias: number): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + dias);
}

export function inicioDeSemana(fecha: Date): Date {
  const dia = normalizarDia(fecha);
  const desplazamiento = (dia.getDay() + 6) % 7;
  return sumarDias(dia, -desplazamiento);
}

export function inicioDeMes(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
}

export function diasDelMes(fecha: Date): number {
  return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
}

export function mismoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function matrizDelMes(fecha: Date): Date[][] {
  const primerDia = inicioDeMes(fecha);
  const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth(), diasDelMes(fecha));
  const fin = sumarDias(inicioDeSemana(ultimoDia), 6);

  const semanas: Date[][] = [];
  let cursor = inicioDeSemana(primerDia);

  while (cursor.getTime() <= fin.getTime()) {
    const semana: Date[] = [];
    for (let i = 0; i < 7; i += 1) {
      semana.push(cursor);
      cursor = sumarDias(cursor, 1);
    }
    semanas.push(semana);
  }

  return semanas;
}


export function tituloMes(fecha: Date): string {
  return capitalizar(formatoMes.format(fecha));
}


export function tituloDia(fecha: Date): string {
  return capitalizar(formatoDia.format(fecha));
}
