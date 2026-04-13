using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxTiposDemandum
{
    public int TipoId { get; set; }

    public string? Tipo { get; set; }

    public int? UsuarioId { get; set; }

    public DateTime? FechaModificacion { get; set; }
}
