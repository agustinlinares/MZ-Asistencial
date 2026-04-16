using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Proveedore
{
    public int ProveedorId { get; set; }

    public int? TipoProveedorId { get; set; }

    public string? Cifnif { get; set; }

    public string? CodigoCuenta { get; set; }

    public string? Proveedor { get; set; }

    public int? PoblacionId { get; set; }

    public string? Cp { get; set; }
}
