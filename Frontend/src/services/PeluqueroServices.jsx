export async function obtenerPeluqueros() {
  const response = await fetch("http://localhost:5143/api/Peluquero");
  return await response.json();
}
export async function crearPeluquero(nuevoPeluquero) {

  const response = await fetch("http://localhost:5143/api/Peluquero", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevoPeluquero)
  });

  const texto = await response.text();

  console.log(texto);

  return texto;
}

export async function editarPeluquero(id, datosActualizados) {
  const body = {
    peluqueroId: id,
    nombre: datosActualizados.nombre,
    apellido: datosActualizados.apellido,
    telefono: datosActualizados.telefono,
    cuil: datosActualizados.cuil,
    fechaContratacion: datosActualizados.fechaContratacion,
  };

  console.log("Body que se manda al PUT:", JSON.stringify(body, null, 2));

  const response = await fetch(`http://localhost:5143/api/Peluquero/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return;
}

export async function eliminarPeluquero(id) {
  await fetch(`http://localhost:5143/api/Peluquero/${id}`, {
    method: "DELETE"
  });
}

export async function obtenerHorariosPeluquero(peluqueroId) {
  const response = await fetch(`${URL}/${peluqueroId}/Horarios`);

  if (!response.ok) {
    throw new Error("Error al obtener horarios");
  }

  return await response.json();
}


export async function crearHorarioPeluquero(peluqueroId, horario) {
  const normalizarHora = (hora) => hora && hora.length === 5 ? hora + ":00" : hora;

  const horarioNormalizado = {
    diaSemana: parseInt(horario.diaSemana),
    horaInicio: normalizarHora(horario.horaInicio),
    horaFin: normalizarHora(horario.horaFin)
  };

  const response = await fetch(`${URL}/${peluqueroId}/Horarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(horarioNormalizado)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
}


export async function eliminarHorarioPeluquero(peluqueroId, horarioId) {
  const response = await fetch(
    `${URL}/${peluqueroId}/Horarios/${horarioId}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error("Error al eliminar horario");
  }
}