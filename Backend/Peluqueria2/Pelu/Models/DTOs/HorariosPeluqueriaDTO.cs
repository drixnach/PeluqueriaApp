namespace Pelu.Models.DTOs
{
    public class HorariosPeluqueriaCreateDTO
    {
        public int DiaSemana { get; set; }
        public TimeOnly HoraAbierto { get; set; }
        public TimeOnly HoraCerrado { get; set; }
    }

    public class HorariosPeluqueriaReadDTO
    {
        public int HorarioPeluqueriaId { get; set; }
        public int DiaSemana { get; set; }
        public TimeOnly HoraAbierto { get; set; }
        public TimeOnly HoraCerrado { get; set; }
    }
}
