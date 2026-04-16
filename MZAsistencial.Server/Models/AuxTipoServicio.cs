using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxTipoServicio
{
    public int TipoServicioId { get; set; }

    public string? TipoServicio { get; set; }

    public string? TipoServicioNan { get; set; }
}
