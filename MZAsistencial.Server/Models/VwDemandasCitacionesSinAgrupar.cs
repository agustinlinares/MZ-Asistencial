using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class VwDemandasCitacionesSinAgrupar
{
    public int Id { get; set; }

    public string? DemandaId { get; set; }

    public int? Anio { get; set; }

    public string? Mutua { get; set; }

    public int? MutuaId { get; set; }

    public int? MutuaOfertanteId { get; set; }

    public string? MutuaOfertante { get; set; }

    public string? Centro { get; set; }

    public string? Especialidad { get; set; }

    public string? Servicio { get; set; }

    public int? CentroId { get; set; }

    public string? Agrupacion { get; set; }

    public int? ServicioId { get; set; }

    public int? EspecialidadId { get; set; }

    public string? FechaConfirmacion { get; set; }

    public DateTime? FechaRevision { get; set; }

    public string? Localidad { get; set; }

    public string? Provincia { get; set; }

    public int? TipoId { get; set; }

    public int CodigoDemanda { get; set; }

    public int TipoMovimientoId { get; set; }

    public string TipoMovimiento { get; set; } = null!;

    public int? PeticionesAtendidas { get; set; }

    public int? PeticionesPendientes { get; set; }

    public int? EstadoId { get; set; }

    public string? DireccionGis { get; set; }

    public string? Telefono { get; set; }

    public DateTime? FechaAsignacion { get; set; }

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

    public int? Dic { get; set; }

    public int? Total { get; set; }

    public DateTime? FechaAltaSolicitud { get; set; }

    public string? Necesidad { get; set; }

    public string? Contestacion { get; set; }

    public int? CitacionId { get; set; }
}
