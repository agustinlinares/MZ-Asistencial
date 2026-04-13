using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class InformesIcg
{
    public int InformeId { get; set; }

    public string? Informe { get; set; }

    public string? ResultadoInforme { get; set; }

    public int? MutuaId { get; set; }

    public int? Año { get; set; }

    public int? Mes { get; set; }

    public int? EstadoInformeId { get; set; }

    public string? TipoIcg { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificación { get; set; }
}
