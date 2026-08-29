using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class HorariosPeluquero
{
    public int HorarioPeluqueroId { get; set; }

    public int? PeluqueroId { get; set; }

    public int? DiaSemana { get; set; }

    public TimeOnly? HoraInicio { get; set; }

    public TimeOnly? HoraFin { get; set; }

    public virtual Peluquero? Peluquero { get; set; }
}
