using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Fichero
{
    public int FicheroId { get; set; }

    public string? Fichero1 { get; set; }

    public string? Descripción { get; set; }

    public int? UsuarioId { get; set; }

    public DateTime? Fecha { get; set; }

    public int? AreaId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacionId { get; set; }
}
