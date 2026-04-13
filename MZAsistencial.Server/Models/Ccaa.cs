using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Ccaa
{
    public int CcaaId { get; set; }

    public string? Ccaa1 { get; set; }

    public virtual ICollection<AuxProvincia> AuxProvincia { get; set; } = new List<AuxProvincia>();
}
