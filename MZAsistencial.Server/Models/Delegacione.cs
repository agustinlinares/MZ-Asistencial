using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Delegacione
{
    public int DelegacionId { get; set; }

    public int ProveedorId { get; set; }

    public string? Delegacion { get; set; }

    public string? CodigoCuenta { get; set; }

    public int? PoblacionId { get; set; }

    public string? Cp { get; set; }
}
