const API_URL = "http://localhost:5143/api/Clientes";

export async function obtenerClientes() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener clientes");
  }

  return await response.json();
}

export async function obtenerClientePorId(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Cliente no encontrado");
  }

  return await response.json();
}

export async function crearCliente(nuevoCliente) {
  const body = {
    nombre: nuevoCliente.nombre,
    apellido: nuevoCliente.apellido,
    correo: nuevoCliente.correo,
    sexo: nuevoCliente.sexo,
    telefono: nuevoCliente.telefono
  };

  console.log("Body que se manda al POST:", JSON.stringify(body, null, 2));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
}

export async function editarCliente(id, datosActualizados) {
  const body = {
    nombre: datosActualizados.nombre,
    apellido: datosActualizados.apellido,
    correo: datosActualizados.correo,
    sexo: datosActualizados.sexo,
    telefono: datosActualizados.telefono
  };

  console.log("Body que se manda al PUT:", JSON.stringify(body, null, 2));

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
}

export async function eliminarCliente(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Error al eliminar cliente");
  }
}