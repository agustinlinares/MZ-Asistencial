using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class FincasRegistralesCostesPorAño
{
    public int FincaId { get; set; }

    public string? Localizador { get; set; }

    public int Año { get; set; }

    public double? Coste { get; set; }

    public int Id { get; set; }

    public virtual FincasRegistrale Finca { get; set; } = null!;
}
