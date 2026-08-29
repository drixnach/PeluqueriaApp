using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class Peluqueria
{
    public int PeluqueriaId { get; set; }

    public int? DireccionId { get; set; }

    public string? Telefono { get; set; }

    public string? Nombre { get; set; }

    public virtual Direccion? Direccion { get; set; }

    public virtual ICollection<HorariosPeluqueria> HorariosPeluqueria { get; set; } = new List<HorariosPeluqueria>();

    public virtual ICollection<Peluquero> Peluqueros { get; set; } = new List<Peluquero>();

    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
