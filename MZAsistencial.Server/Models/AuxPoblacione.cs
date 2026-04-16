using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxPoblacione
{
    public int PoblacionId { get; set; }

    public string? Poblacion { get; set; }

    public int ProvinciaId { get; set; }

    public virtual ICollection<AuxPoblacionesCodPostale> AuxPoblacionesCodPostales { get; set; } = new List<AuxPoblacionesCodPostale>();

    public virtual AuxProvincia Provincia { get; set; } = null!;
}
