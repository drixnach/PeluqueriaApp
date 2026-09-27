const STORAGE_KEY= 'auth'

export function obtenerToken(){
    const guardado= localStorage.getItem(STORAGE_KEY)
    if (!guardado) return null
    try{
        return JSON.parse(guardado).token
    }catch{
        return null
    }
}

export async function apiFetch(url, options={}) {
    const token=obtenerToken()

    const headers={
        ...(options.headers||{}),
        ...(token?{Authorization:`Bearer ${token}`}:{})
    }

    const response= await fetch(url,{...options,headers})

    if (response.status===401){
        localStorage.removeItem(STORAGE_KEY)
    }

    return response
}