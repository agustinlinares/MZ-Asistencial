using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Concierto
{
    public int ConciertoId { get; set; }

    public int MutuaId { get; set; }

    public int CentroId { get; set; }

    public string? CodigoCasa { get; set; }

    public string? CodigoMz { get; set; }

    public int? CentroAsociadoId { get; set; }

    public string? Localizador { get; set; }

    public int? TipoAsistenciaId { get; set; }

    public int? AmbitoCobertura { get; set; }

    public string? Muniambito { get; set; }

    public bool? Autorizado { get; set; }

    public DateTime? FechaAutorizacion { get; set; }

    public int? UsuarioAutorizacionId { get; set; }

    public DateTime? FechaSuscripcion { get; set; }

    public DateTime? FechaResolucion { get; set; }

    public DateTime? FechaVigencia { get; set; }

    public DateTime? FechaProrroga { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public DateTime? FechaBaja { get; set; }

    public int? UsuarioBajaId { get; set; }

    public int? Adhesion { get; set; }

    public int? ClaveAcces { get; set; }
}
