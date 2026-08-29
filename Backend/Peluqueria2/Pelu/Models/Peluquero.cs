using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class Peluquero
{
    public int PeluqueroId { get; set; }

    public string? Nombre { get; set; }

    public string? Apellido { get; set; }

    public string? Telefono { get; set; }

    public int? PeluqueriaId { get; set; }

    public DateOnly? FechaContratacion { get; set; }

    public string? Cuil { get; set; }

    public int? DireccionId { get; set; }

    public virtual Direccion? Direccion { get; set; }

    public virtual ICollection<HorariosPeluquero> HorariosPeluqueros { get; set; } = new List<HorariosPeluquero>();

    public virtual Peluqueria? Peluqueria { get; set; }

    public virtual ICollection<PeluqueroxServicio> PeluqueroxServicios { get; set; } = new List<PeluqueroxServicio>();

    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
