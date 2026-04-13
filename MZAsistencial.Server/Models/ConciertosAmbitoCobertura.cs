using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class ConciertosAmbitoCobertura
{
    public int Id { get; set; }

    public int ConciertoId { get; set; }

    public int AmbitoId { get; set; }

    public int PoblacionId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public string? Cp { get; set; }
}
