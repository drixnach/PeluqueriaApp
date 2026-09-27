const URL="http://localhost:5143/api/Auth";

export async function loginRequest(email, password) {
    const response= await fetch(`${URL}/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    })

    if(!response.ok){
        throw new Error("credenciales invalidas")
    }

    return await response.json()
}