using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AccessFincasRegistrale
{
    public string? Idcentro { get; set; }

    public int? Ejerc { get; set; }

    public string? ViaPublica { get; set; }

    public string? NombreVia { get; set; }

    public string? NumVia { get; set; }

    public string? Piso { get; set; }

    public string? Puerta { get; set; }

    public string? Otrosdatos { get; set; }

    public decimal? SupConst { get; set; }

    public decimal? Costealq { get; set; }

    public string? Titinmueble { get; set; }

    public DateTime? Fadqoarr { get; set; }

    public DateTime? Finscreg { get; set; }

    public string? Utilizacion { get; set; }

    public string? ReferenciaCatastral { get; set; }

    public int? MutuaId { get; set; }
}
