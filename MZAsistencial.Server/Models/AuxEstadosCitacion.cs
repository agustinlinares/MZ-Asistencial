using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxEstadosCitacion
{
    public int EstadoId { get; set; }

    public string? Estado { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? Agrupacion { get; set; }
}
