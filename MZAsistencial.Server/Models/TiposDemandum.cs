using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class TiposDemandum
{
    public int TipoDemandaId { get; set; }

    public int Año { get; set; }

    public string TipoDemanda { get; set; } = null!;

    public DateOnly PeriodoDesde { get; set; }

    public DateOnly PeriodoHasta { get; set; }

    public int? ActivaId { get; set; }

    public int? TipoId { get; set; }

    public int? GeneracionAcreditacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacionId { get; set; }
}
