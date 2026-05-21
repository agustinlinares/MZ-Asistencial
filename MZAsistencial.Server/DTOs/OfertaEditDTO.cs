namespace MZAsistencial.Server.DTOs;

public class OfertaEditDTO
{
    public int OfertaId { get; set; }
    public int? EspecialidadId { get; set; }
    public int? ServicioId { get; set; }
    public int? CentroId { get; set; }
    public int? Año { get; set; }
    public int? DemandaId { get; set; }
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
    public int? EstadoId { get; set; }
    public string? NotaContestacion { get; set; }
    public string? ContestacionPlazos { get; set; }

    // Datos descriptivos
    public string? MutuaOferta { get; set; }
    public string? Centro { get; set; }
    public string? Especialidad { get; set; }
    public string? Servicio { get; set; }
    public string? Estado { get; set; }
    public string? TipoDemanda { get; set; }

    // Meses de la demanda
    public int? DemandaEne { get; set; }
    public int? DemandaFeb { get; set; }
    public int? DemandaMar { get; set; }
    public int? DemandaAbr { get; set; }
    public int? DemandaMay { get; set; }
    public int? DemandaJun { get; set; }
    public int? DemandaJul { get; set; }
    public int? DemandaAgo { get; set; }
    public int? DemandaSep { get; set; }
    public int? DemandaOct { get; set; }
    public int? DemandaNov { get; set; }
    public int? DemandaDic { get; set; }
}