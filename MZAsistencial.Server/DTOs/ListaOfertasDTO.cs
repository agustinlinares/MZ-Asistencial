namespace MZAsistencial.Server.DTOs;

public class ListaOfertasDTO
{
    public int OfertaId { get; set; }
    public int? Año { get; set; }
    public string? MutuaOferta { get; set; }
    public string? Centro { get; set; }
    public string? TipoLinea { get; set; }
    public string? Provincia { get; set; }
    public string? Localidad { get; set; }
    public string? Especialidad { get; set; }
    public string? TipoMovimiento { get; set; }
    public string? Servicio { get; set; }
    public int? NumeroPeticiones { get; set; }
    public int? PeticionesPendientesAsignar { get; set; }
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
    public int? EstadoId { get; set; }
    public string? Estado { get; set; }
    public int? DemandaId { get; set; }
    public DateTime? FechaSolicitud { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public string? NecesidadesServicio { get; set; }
    public string? ContestacionNecesidades { get; set; }
    public string? RowKey { get; set; }

    // Disponibilidad real (declarada - comprometida)
    public int? DispEne { get; set; }
    public int? DispFeb { get; set; }
    public int? DispMar { get; set; }
    public int? DispAbr { get; set; }
    public int? DispMay { get; set; }
    public int? DispJun { get; set; }
    public int? DispJul { get; set; }
    public int? DispAgo { get; set; }
    public int? DispSep { get; set; }
    public int? DispOct { get; set; }
    public int? DispNov { get; set; }
    public int? DispDic { get; set; }
    public int? DispTotal { get; set; }

    // Campos para vista desagrupada
    public string? NotaContestacion { get; set; }
    public string? ContestacionPlazos { get; set; }

    /// <summary>
    /// Clave de agrupación preconstruida en el backend.
    /// Formato: "Año: 2026 | Mutua: Entidad 1 | Centro: Centro de pruebas |
    ///           Especialidad: CONSULTAS GEN | Servicio: A.9.1 FISIOTERAPIA | Población: Madrid"
    /// DevExtreme agrupa automáticamente por este campo al cargar.
    /// </summary>
    public string? GrupoKey { get; set; }
}