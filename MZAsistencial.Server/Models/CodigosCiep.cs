using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class CodigosCiep
{
    public int CiepId { get; set; }

    public string Ciep { get; set; } = null!;

    public int EspecialidadId { get; set; }
}
