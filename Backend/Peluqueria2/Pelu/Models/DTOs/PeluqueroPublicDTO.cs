namespace Pelu.Models.DTOs
{
    public class PeluqueroPublicDTO
    {
        public int PeluqueroId { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Peluqueria { get; set; }
        public List<string> Servicios {  get; set; }
    }
}
