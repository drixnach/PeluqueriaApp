using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class Servicio
{
    public int ServicioId { get; set; }

    public string? Nombre { get; set; }

    public decimal? Precio { get; set; }

    public string? Descripcion { get; set; }

    public int? Duracion { get; set; }

    public virtual ICollection<DetalleTurno> DetalleTurnos { get; set; } = new List<DetalleTurno>();

    public virtual ICollection<PeluqueroxServicio> PeluqueroxServicios { get; set; } = new List<PeluqueroxServicio>();
}
