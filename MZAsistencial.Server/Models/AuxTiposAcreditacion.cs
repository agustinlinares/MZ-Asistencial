using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxTiposAcreditacion
{
    public int TipoAcreditacionId { get; set; }

    public string? TipoAcreditacion { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public DateTime? FechaModificacion { get; set; }
}
