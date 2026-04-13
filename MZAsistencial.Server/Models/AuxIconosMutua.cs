using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxIconosMutua
{
    public int IconoId { get; set; }

    public int? MutuaId { get; set; }

    public string? Icono { get; set; }
}
