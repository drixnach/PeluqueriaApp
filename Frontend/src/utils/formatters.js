// Funciones de formateo y cálculo compartidas entre vistas de administración.

export function calcularAntiguedad(fechaStr) {
  if (!fechaStr) return 0;
  const hoy = new Date();
  const fechaContratacion = new Date(fechaStr);
  let antiguedad = hoy.getFullYear() - fechaContratacion.getFullYear();
  const m = hoy.getMonth() - fechaContratacion.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaContratacion.getDate())) {
    antiguedad--;
  }
  return antiguedad;
}

export function getNombreDia(numeroDia) {
  const dias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return dias[numeroDia] || "Desconocido";
}

export function formatearSexo(sexo) {
  if (!sexo) return '-';
  switch (sexo.toLowerCase()) {
    case 'femenino': return 'Fem';
    case 'masculino': return 'Masc';
    default: return 'Otro';
  }
}
