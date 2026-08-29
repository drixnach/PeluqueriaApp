using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class PeluqueroxServicio
{
    public int EmpleadoxServicioId { get; set; }

    public int? PeluqueroId { get; set; }

    public int? ServicioId { get; set; }

    public virtual Peluquero? Peluquero { get; set; }

    public virtual Servicio? Servicio { get; set; }
}
