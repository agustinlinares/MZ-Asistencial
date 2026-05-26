namespace MZAsistencial.Server.DTOs;

public class ListaDemandasDTO
{
    public string RowKey { get; set; } = "";
    public string? TipoLinea { get; set; }
    public int DemandaId { get; set; }
    public int? Año { get; set; }
    public string? MutuaSolicitante { get; set; }
    public string? MutuaOfertante { get; set; }
    public string? Localidad { get; set; }
    public string? Centro { get; set; }
    public string? Especialidad { get; set; }
    public string? TipoMovimiento { get; set; }
    public string? Servicio { get; set; }
    public string? Estado { get; set; }
    public int? EstadoId { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public DateTime? FechaSolicitud { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public string? NecesidadesServicio { get; set; }
    public string? ContestacionNecesidades { get; set; }
    public int? PeticionesAsignadas { get; set; }
    public int? PeticionesPendientes { get; set; }
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
    public int Total { get; set; }
    // Meses de la oferta asociada
    public int? OfertaEne { get; set; }
    public int? OfertaFeb { get; set; }
    public int? OfertaMar { get; set; }
    public int? OfertaAbr { get; set; }
    public int? OfertaMay { get; set; }
    public int? OfertaJun { get; set; }
    public int? OfertaJul { get; set; }
    public int? OfertaAgo { get; set; }
    public int? OfertaSep { get; set; }
    public int? OfertaOct { get; set; }
    public int? OfertaNov { get; set; }
    public int? OfertaDic { get; set; }
    public int OfertaTotal { get; set; }
    public int? OfertaId { get; set; }
}