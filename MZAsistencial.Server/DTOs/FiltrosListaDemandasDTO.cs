namespace MZAsistencial.Server.DTOs;

public class FiltrosListaDemandasDTO
{
    public int? Año { get; set; }
    public int? EstadoId { get; set; }
    public string? Tipo { get; set; }
    public bool VistaAgrupada { get; set; }
    public DateTime? FechaSolicitudDesde { get; set; }
    public DateTime? FechaSolicitudHasta { get; set; }
    public DateTime? FechaAsignacionDesde { get; set; }
    public DateTime? FechaAsignacionHasta { get; set; }
    public DateTime? FechaConfirmacionDesde { get; set; }
    public DateTime? FechaConfirmacionHasta { get; set; }
    public string? NecesidadesServicio { get; set; }
    public string? ContestacionNecesidades { get; set; }
    public int? DemandaId { get; set; }
}