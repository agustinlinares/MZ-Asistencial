using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxPoblacionesCodPostale
{
    public int RegistroId { get; set; }

    public int PoblacionId { get; set; }

    public string Cp { get; set; } = null!;

    public virtual AuxPoblacione Poblacion { get; set; } = null!;
}
