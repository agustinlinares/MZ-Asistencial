using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class InformesDireccionAgrupado
{
    public int InformeId { get; set; }

    public string? Informe { get; set; }

    public int? MutuaId { get; set; }

    public int? Año { get; set; }

    public int? Mes { get; set; }

    public int? Activo { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacion { get; set; }
}
