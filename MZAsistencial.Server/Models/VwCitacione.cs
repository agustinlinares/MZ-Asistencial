using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class VwCitacione
{
    public int? Id { get; set; }

    public int? Año { get; set; }

    public string? MutuaOfertante { get; set; }

    public string? MutuaSolicitante { get; set; }

    public string? Centro { get; set; }

    public string Provincia { get; set; } = null!;

    public string? Localidad { get; set; }

    public string? Especialidad { get; set; }

    public int? MovimientoId { get; set; }

    public string? TipoMovimiento { get; set; }

    public string? Servicio { get; set; }

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

    public int? Total { get; set; }

    public string? DireccionGis { get; set; }

    public string? Telefono { get; set; }

    public DateTime? FechaAsignacion { get; set; }

    public DateTime? FechaConfirmacion { get; set; }

    public DateTime? FechaAltaSolicitud { get; set; }

    public string? Necesidad { get; set; }

    public string? Contestacion { get; set; }

    public int? EstadoId { get; set; }

    public int MutuaOfertanteId { get; set; }

    public int MutuaDemandanteId { get; set; }

    public int? CitacionId { get; set; }

    public int? CentroId { get; set; }

    public int? EspecialidadId { get; set; }

    public long? ServicioId { get; set; }

    public int? ProvinciaId { get; set; }

    public int? LocalidadId { get; set; }

    public string? Estado { get; set; }

    public string? MotivoRechazo { get; set; }

    public DateTime? FechaRechazo { get; set; }

    public DateTime? FechaRespuestaCitacion { get; set; }
}
