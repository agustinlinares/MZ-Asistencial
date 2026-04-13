using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class CitacionDocumentacion
{
    public long DocId { get; set; }

    public string? Nombre { get; set; }

    public string? NombreFisicoServidor { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAlta { get; set; }

    public int? MutuaId { get; set; }

    public int? CitacionId { get; set; }

    public int? DemandaId { get; set; }
}
