using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxProvincia
{
    public int ProvinciaId { get; set; }

    public int CcaaId { get; set; }

    public string Provincia { get; set; } = null!;

    public virtual ICollection<AuxPoblacione> AuxPoblaciones { get; set; } = new List<AuxPoblacione>();

    public virtual Ccaa Ccaa { get; set; } = null!;
}
