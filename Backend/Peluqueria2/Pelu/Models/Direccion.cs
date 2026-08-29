using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class Direccion
{
    public int DireccionId { get; set; }

    public string? Calle { get; set; }

    public string? Altura { get; set; }

    public string? Ciudad { get; set; }

    public string? Provincia { get; set; }

    public string? CodigoPostal { get; set; }

    public string? Pais { get; set; }

    public virtual ICollection<Peluqueria> Peluqueria { get; set; } = new List<Peluqueria>();

    public virtual ICollection<Peluquero> Peluqueros { get; set; } = new List<Peluquero>();
}
