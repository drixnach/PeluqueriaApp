namespace Pelu.Models.DTOs
{
    public class ServicioCreateDTO
    {
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public int Duracion { get; set; }
        public decimal Precio { get; set; }
    }

        public class ServicioReadDTO
        {
            public int ServicioId { get; set; }
            public string? Nombre { get; set; }
            public string? Descripcion { get; set; }
            public int Duracion { get; set; }
            public decimal Precio { get; set; }
    }
}
