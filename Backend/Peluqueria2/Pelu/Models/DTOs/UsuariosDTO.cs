namespace Pelu.Models.DTOs
{
    public class RegisterClienteRequest
    {
       public string Nombre { get; set; } = "";
        public string Apellido { get; set; } = "";
        public string sexo { get; set; } = "";
        public string Telefono { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class RegisterStaffRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string Rol { get; set; } = "";       // Admin o Peluquero
        public int? PeluqueroId { get; set; }        // requerido si Rol == Peluquero
    }

    public class LoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
