using System;
using System.Collections.Generic;

namespace Pelu.Models;

public partial class Cliente
{
    public int ClienteId { get; set; }

    public string? Nombre { get; set; }

    public string? Apellido { get; set; }

    public string? Correo { get; set; }

    public string? Sexo { get; set; }

    public string? Telefono { get; set; }

    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
