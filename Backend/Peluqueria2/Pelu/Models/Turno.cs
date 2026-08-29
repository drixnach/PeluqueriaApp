using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class Turno
{
    public int TurnoId { get; set; }

    public int? ClienteId { get; set; }

    public int? PeluqueroId { get; set; }

    public int? PeluqueriaId { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public DateTime? FechaInicioTurno { get; set; }

    public DateTime? FechaFinTurno { get; set; }

    public virtual Cliente? Cliente { get; set; }

    public virtual ICollection<DetalleTurno> DetalleTurnos { get; set; } = new List<DetalleTurno>();

    public virtual Peluqueria? Peluqueria { get; set; }

    public virtual Peluquero? Peluquero { get; set; }
}
