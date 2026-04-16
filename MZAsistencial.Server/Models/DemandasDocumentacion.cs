using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class DemandasDocumentacion
{
    public int DocumentoId { get; set; }

    public string? NombreDocumento { get; set; }

    public string? Nombre { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAlta { get; set; }

    public int? MutuaId { get; set; }

    public int? DemandaId { get; set; }
}
