namespace Pelu.Models.DTOs
{
    public class ClienteCreateDTO
    {
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Correo { get; set; }
        public string? Sexo { get; set; }
        public string? Telefono { get; set; }
    }

    public class ClienteReadDto
    {
        public int ClienteId { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public string? Sexo { get; set; }
    }
}
