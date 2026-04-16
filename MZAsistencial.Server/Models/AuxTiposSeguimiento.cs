using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxTiposSeguimiento
{
    public long TipoAccionId { get; set; }

    public string? TipoAccion { get; set; }

    public long? UsuarioModificacionId { get; set; }

    public DateTime? FechaModificacion { get; set; }
}
