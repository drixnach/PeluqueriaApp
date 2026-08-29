using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class DetalleTurno
{
    public int DetalleTurnoId { get; set; }

    public int? TurnoId { get; set; }

    public int? ServicioId { get; set; }

    public decimal? Precio { get; set; }

    public virtual Servicio? Servicio { get; set; }

    public virtual Turno? Turno { get; set; }
}
