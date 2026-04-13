using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class TiposVium
{
    public int TipoViaId { get; set; }

    public string TipoVia { get; set; } = null!;

    public string TipoViaAbreviada { get; set; } = null!;
}
