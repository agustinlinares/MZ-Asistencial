using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MZAsistencial.Server.Models;

public partial class Citacione
{
    public int CitacionId { get; set; }

    public int? MutaOferta { get; set; }

    public int? MutuaDemandante { get; set; }

    public int? CentroId { get; set; }

    public int? ProvinciaId { get; set; }

    public int? Localidad { get; set; }

    public int? EspecialidadId { get; set; }

    public int? ServicioId { get; set; }

    public int? MovimientoId { get; set; }

    public int? DemandaId { get; set; }

    public DateTime? FechaAltaSolicitud { get; set; }

    public DateTime? FechaRespuestaCitacion { get; set; }

    public string? Necesidad { get; set; }

    public string? Contestacion { get; set; }

    public int? Ene { get; set; }

    public int? Feb { get; set; }

    public int? Mar { get; set; }

    public int? Abr { get; set; }

    public int? May { get; set; }

    public int? Jun { get; set; }

    public int? Jul { get; set; }

    public int? Ago { get; set; }

    public int? Sep { get; set; }

    public int? Oct { get; set; }

    public int? Nov { get; set; }

    public int? Diciembre { get; set; }

    [Column("Anio")]
    public int? Año { get; set; }

    public int? Total { get; set; }

    public int? EstadoId { get; set; }

    public string? MotivoRechazo { get; set; }

    public DateTime? FechaRechazo { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public DateTime? FechaModificacion { get; set; }
}
