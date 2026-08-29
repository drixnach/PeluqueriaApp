const API_URL = "http://localhost:5143/api/Peluqueria";

// OBTENER PELUQUERIAS
export async function obtenerPeluquerias() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener peluquerías");
  }

  return await response.json();
}