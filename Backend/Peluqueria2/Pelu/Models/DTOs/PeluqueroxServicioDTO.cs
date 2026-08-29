namespace Pelu.Models.DTOs
{
    public class PeluqueroxServicioCreateDTO
    { 
     public int ServicioId { get; set; }
    }

    public class PeluqueroxServicioReadDTO
    {
        public int EmpleadoxServicioID { get; set; }
        public int PeluqueroId { get; set; }
        public int ServicioId { get; set; }
        public string NombreServicio { get; set; }
    }
}
