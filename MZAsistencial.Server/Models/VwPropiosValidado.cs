using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class VwPropiosValidado
{
    public int Año { get; set; }

    public int MutuaId { get; set; }

    public int? CentroId { get; set; }
}
