const API_URL = "http://localhost:5143/api/PeluqueroxServicio";

export async function obtenerServiciosDePeluquero(id) {
  const response = await fetch(`${API_URL}/Peluquero/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener servicios del peluquero");
  }

  return await response.json();
}