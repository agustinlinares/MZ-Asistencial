using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxTipoAnulacion
{
    public int TipoAnulacionId { get; set; }

    public string? Motivo { get; set; }
}
