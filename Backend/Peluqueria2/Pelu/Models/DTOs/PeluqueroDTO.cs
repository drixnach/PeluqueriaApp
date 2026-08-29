namespace Pelu.Models.DTOs
{
    public class PeluqueroCreateDto
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Telefono { get; set; }
        public int PeluqueriaId { get; set; }   
        public DateTime FechaContratacion { get; set; }
        public string Cuil { get; set; }
        public int? DireccionId { get; set; }
        public DireccionCreateDTO? Direccion { get; set; }
        public List<int> ServicioIds { get; set; } = new();
    }

    public class PeluqueroReadDto
    {
        public int PeluqueroId { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Telefono { get; set; }
        public DateTime FechaContratacion { get; set; }
        public string Cuil { get; set; }

        public string? NombrePeluqueria { get; set; }
        public List<string> Servicios { get; set; } = new();
    }
}
