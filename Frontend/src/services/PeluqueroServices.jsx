import {apiFetch} from './ApiFetch'

const URL="http://localhost:5143/api/Peluquero"

export async function obtenerPeluqueros(){
  const response=await fetch(URL)

  if (!response.ok){
    throw error("Error al obtener peluqueros")
  }

  return await response.json()
}

export async function obtenerPeluquerosAdmin(){
  const response=await apiFetch(`${URL}/admin`)

  if(!response.ok){
    throw error("Error al obtener peluqueros (admin)")
  }

  return await response.json()
}

export async function crearPeluquero(nuevoPeluquero) {
  const response=await apiFetch(URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
body:JSON.stringify(nuevoPeluquero)
  })

  if(!response.ok){
    const error= await response.text()
    throw new Error(error)
  }
  return await response.json()
}

export async function editarPeluquero(id, datosActualizados) {
  const url=`${URL}/${id}`
  
  const res= await apiFetch(url,{
    method:'PUT',
    headers:{"Content-type":"application/jsopn"},
    body: JSON.stringify(datosActualizados)
  })
  
  if(!res.ok){
    const text=await res.text()
    throw new Error(`Error ${res.status}: ${text}`)
  }

  if (res.status===204) return null

  const contentType=res.headers.get('content-type') || ''

  if (contentType.includes('application/json')){
    return await res.json()
  } else {return null}
}

export async function eliminarPeluquero(id) {
  const response=await apiFetch(`${URL}/${id}`,{
    method:"DELETE"
  })
  if(!response.ok){
    throw new Error("Error al eliminar peluquero")
  }
}

export async function obtenerHorariosPeluquero(peluqueroId) {
  const response= await fetch(`${URL}/${peluqueroId}/Horarios`)

  if(!response.ok){
    throw new Error("error al obtener horarios")
  }

  return await response.json()
}

export async function crearHorarioPeluquero(peluqueroId, horario) {
  const normalizarHora = (hora) => hora && hora.length === 5 ? hora + ":00" : hora;

  const horarioNormalizado = {
    diaSemana: parseInt(horario.diaSemana),
    horaInicio: normalizarHora(horario.horaInicio),
    horaFin: normalizarHora(horario.horaFin)
  };

  const response = await apiFetch(`${URL}/${peluqueroId}/Horarios`, {
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
  const response = await apiFetch(
    `${URL}/${peluqueroId}/Horarios/${horarioId}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error("Error al eliminar horario");
  }
}


