using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxDescripcionesSeguimiento
{
    public long DescripcionAccionId { get; set; }

    public string? DescripcionAccion { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public DateTime? FechaModificacion { get; set; }
}
