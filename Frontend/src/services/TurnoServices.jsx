const API_URL = "http://localhost:5143/api/Turno";

export async function obtenerTurnos() {

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener turnos");
  }

  return await response.json();
}

export async function crearTurno(turno) {
  console.log("Body que se manda al TurnoController:", JSON.stringify(turno, null, 2));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(turno)
  });

  if (!response.ok) {
    throw new Error("Error al crear turno");
  }

  return await response.json();
}

export async function editarTurno(id, turno) {

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(turno)
  });

  if (!response.ok) {
    throw new Error("Error al editar turno");
  }
}

export async function eliminarTurno(id) {

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Error al eliminar turno");
  }
}