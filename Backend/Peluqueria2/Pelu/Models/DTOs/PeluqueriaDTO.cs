namespace Pelu.Models.DTOs
{
    public class PeluqueriaCreateDTO
    {
        public string? Nombre { get; set; }
        public string? Telefono { get; set; }
        public int? DireccionId { get; set; }

    }

    public class PeluqueriaReadDTO
    {
        public int PeluqueriaId { get; set; }
        public string? Nombre { get; set; }
        public string? Telefono { get; set; }
        public int? DireccionId { get; set; }
        public string? DireccionTexto { get; set; }
    }
}
