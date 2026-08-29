namespace Pelu.Models.DTOs
{
    public class TurnosCreateDTO
    {
        public int ClienteId { get; set; }
        public int PeluqueroId { get; set; }
        public int peluqueriaId { get; set; }
        public DateTime FechaInicioTurno { get; set; }
        public DateTime FechaFinTurno { get; set; }
        public List<int>? ServiciosIds { get; set; } = new();
    }

    public class ServiciosTurnoDTO
    {
        public int ServicioId { get; set; }
        public string? Nombre {  get; set; }
        public decimal Precio { get; set; }
    }

    public class TurnosReadDTO
    {
        public int TurnoId { get; set; }
        public DateTime FechaInicioTurno { get; set; }
        public DateTime FechaFinTurno { get; set; }
        public string? NombreCliente { get; set; }
        public string? NombrePeluquero { get; set; }
        public string?NombrePeluqueria { get; set; }
        public List<ServiciosTurnoDTO> Servicios { get; set; } = new();
    }
}
