namespace Pelu.Models.DTOs
{
    public class DireccionCreateDTO
    {
        public string Calle { get; set; }
        public string Altura { get; set; }
        public string Ciudad { get; set; }
        public string Provincia { get; set; }
        public string CodigoPostal { get; set; }
        public string Pais { get; set; }
    }

    public class DireccionReadDTO { 
    
        public int DireccionId { get; set; }
        public string Calle { get; set; }
        public string Altura { get; set; }
        public string Ciudad { get; set; }
        public string Provincia { get; set; }
        public string CodigoPostal { get; set; }
        public string Pais { get; set; }


    }
}
