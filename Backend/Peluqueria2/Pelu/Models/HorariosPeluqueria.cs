using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class HorariosPeluqueria
{
    public int HorarioPeluqueriaId { get; set; }

    public int? PeluqueriaId { get; set; }

    public int? DiaSemana { get; set; }

    public TimeOnly? HoraAbierto { get; set; }

    public TimeOnly? HoraCerrado { get; set; }

    public virtual Peluqueria? Peluqueria { get; set; }
}
