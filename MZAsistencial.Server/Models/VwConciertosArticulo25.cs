using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class VwConciertosArticulo25
{
    public int Año { get; set; }

    public int ConciertoId { get; set; }

    public int MutuaId { get; set; }

    public int CentroId { get; set; }

    public string CapituloCm { get; set; } = null!;

    public string ConceptoCm { get; set; } = null!;

    public string? Centro { get; set; }

    public decimal? Respuesta { get; set; }
}
