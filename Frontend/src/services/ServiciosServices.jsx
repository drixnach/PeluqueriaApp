const API_URL = "http://localhost:5143/api/Servicio";

export async function obtenerServicios() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener servicios");
  }

  return await response.json();
}