export function rutaPorRol(rol){
    if(rol==='Admin') return '/admin';
    if (rol==='Peluquero') return '/peluquero'
    return '/'
}