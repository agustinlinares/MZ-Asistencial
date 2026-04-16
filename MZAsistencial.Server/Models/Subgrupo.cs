using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Subgrupo
{
    public string SubgrupoId { get; set; } = null!;

    public string? Subgrupo1 { get; set; }

    public string GrupoId { get; set; } = null!;

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacionId { get; set; }
}
