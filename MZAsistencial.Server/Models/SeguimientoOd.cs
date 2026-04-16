using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class SeguimientoOd
{
    public long GestionId { get; set; }

    public long? UsuarioId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public long? TipoAccionId { get; set; }

    public long? DescripcionAccionId { get; set; }

    public long? OfertaDemandaId { get; set; }

    public long? EstadoId { get; set; }

    public string? Nota { get; set; }

    public int? EstadoLinea { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public long? UsuarioModificacionId { get; set; }
}
