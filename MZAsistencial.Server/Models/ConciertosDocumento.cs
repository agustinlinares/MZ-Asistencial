using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class ConciertosDocumento
{
    public int? ConciertoId { get; set; }

    public int DocumentoId { get; set; }

    public string? Documento { get; set; }

    public string? Titulo { get; set; }

    public DateTime? FechaVigencia { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public string? Observaciones { get; set; }
}
