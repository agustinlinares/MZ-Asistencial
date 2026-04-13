using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class FicherosGenerado
{
    public int FicheroGeneradoId { get; set; }

    public string? MutuaId { get; set; }

    public int? Año { get; set; }

    public string? FicheroGenerado { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? EstadoId { get; set; }

    public int? TipoCentroId { get; set; }

    public int? TipoConciertoId { get; set; }
}
