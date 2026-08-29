namespace Pelu.Models.DTOs
{
    public class HorariosPeluqueroCreateDTO
    {
        public int DiaSemana { get; set; }
        public TimeOnly HoraInicio { get; set; }
        public TimeOnly HoraFin { get; set; }
    }

    public class HorariosPeluqueroReadDTO   
    {
        public int HorarioPeluqueroId { get; set; }
        public int DiaSemana { get; set; }
        public TimeOnly HoraInicio { get; set; }
        public TimeOnly HoraFin { get; set; }
    }
}
