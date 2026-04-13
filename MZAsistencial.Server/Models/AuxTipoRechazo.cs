using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxTipoRechazo
{
    public int TipoRechazoId { get; set; }

    public string? Rechazo { get; set; }
}
