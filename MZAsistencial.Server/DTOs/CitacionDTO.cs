using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MZAsistencial.Server.DTOs;

public class CitacionDTO
{
    [JsonPropertyName("CitacionId")]
    public int? CitacionId { get; set; }

    [JsonPropertyName("DemandaId")]
    public int? DemandaId { get; set; }

    [JsonPropertyName("Anio")]
    [Range(2000, 2100, ErrorMessage = "El año debe estar entre 2000 y 2100")]
    public int? Anio { get; set; }

    [JsonPropertyName("MutuaOfertante")]
    public string? MutuaOfertante { get; set; }

    [JsonPropertyName("MutuaSolicitante")]
    public string? MutuaSolicitante { get; set; }

    [JsonPropertyName("Centro")]
    public string? Centro { get; set; }

    [JsonPropertyName("Especialidad")]
    public string? Especialidad { get; set; }

    [JsonPropertyName("Servicio")]
    public string? Servicio { get; set; }

    [JsonPropertyName("Estado")]
    public string? Estado { get; set; }

    [JsonPropertyName("Ene")]
    public int? Ene { get; set; }

    [JsonPropertyName("Feb")]
    public int? Feb { get; set; }

    [JsonPropertyName("Mar")]
    public int? Mar { get; set; }

    [JsonPropertyName("Abr")]
    public int? Abr { get; set; }

    [JsonPropertyName("May")]
    public int? May { get; set; }

    [JsonPropertyName("Jun")]
    public int? Jun { get; set; }

    [JsonPropertyName("Jul")]
    public int? Jul { get; set; }

    [JsonPropertyName("Ago")]
    public int? Ago { get; set; }

    [JsonPropertyName("Sep")]
    public int? Sep { get; set; }

    [JsonPropertyName("Oct")]
    public int? Oct { get; set; }

    [JsonPropertyName("Nov")]
    public int? Nov { get; set; }

    [JsonPropertyName("Diciembre")]
    public int? Diciembre { get; set; }

    [JsonPropertyName("Total")]
    [Range(0, 1000000, ErrorMessage = "La cantidad total no puede ser negativa")]
    public int? Total { get; set; }

    [JsonPropertyName("FechaAltaSolicitud")]
    public DateTime? FechaAltaSolicitud { get; set; }

    [JsonPropertyName("EstadoId")]
    public int? EstadoId { get; set; }

    [JsonPropertyName("MutuaOfertanteId")]
    public int? MutuaOfertanteId { get; set; }

    [JsonPropertyName("CentroId")]
    public int? CentroId { get; set; }

    [JsonPropertyName("EspecialidadId")]
    public int? EspecialidadId { get; set; }

    [JsonPropertyName("ServicioId")]
    public long? ServicioId { get; set; }

    [JsonPropertyName("ProvinciaId")]
    public int? ProvinciaId { get; set; }

    [JsonPropertyName("LocalidadId")]
    public int? LocalidadId { get; set; }

    [JsonPropertyName("MutuaDemandanteId")]
    public int? MutuaDemandanteId { get; set; }

    [JsonPropertyName("Necesidad")]
    [Required(ErrorMessage = "La necesidad es obligatoria")]
    [StringLength(500, ErrorMessage = "La necesidad no puede superar los 500 caracteres")]
    public string? Necesidad { get; set; }

    [JsonPropertyName("Provincia")]
    public string? Provincia { get; set; }

    [JsonPropertyName("Localidad")]
    public string? Localidad { get; set; }

    [JsonPropertyName("Direccion")]
    public string? Direccion { get; set; }

    [JsonPropertyName("Telefono")]
    public string? Telefono { get; set; }

    [JsonPropertyName("Contestacion")]
    public string? Contestacion { get; set; }

    [JsonPropertyName("FechaContestacion")]
    public DateTime? FechaContestacion { get; set; }

    // Campos de la Demanda para la fila "RESERVA"
    [JsonPropertyName("DemandaEne")] public int? DemandaEne { get; set; }
    [JsonPropertyName("DemandaFeb")] public int? DemandaFeb { get; set; }
    [JsonPropertyName("DemandaMar")] public int? DemandaMar { get; set; }
    [JsonPropertyName("DemandaAbr")] public int? DemandaAbr { get; set; }
    [JsonPropertyName("DemandaMay")] public int? DemandaMay { get; set; }
    [JsonPropertyName("DemandaJun")] public int? DemandaJun { get; set; }
    [JsonPropertyName("DemandaJul")] public int? DemandaJul { get; set; }
    [JsonPropertyName("DemandaAgo")] public int? DemandaAgo { get; set; }
    [JsonPropertyName("DemandaSep")] public int? DemandaSep { get; set; }
    [JsonPropertyName("DemandaOct")] public int? DemandaOct { get; set; }
    [JsonPropertyName("DemandaNov")] public int? DemandaNov { get; set; }
    [JsonPropertyName("DemandaDic")] public int? DemandaDic { get; set; }
    [JsonPropertyName("DemandaTotal")] public int? DemandaTotal { get; set; }

    // Campos del Consumo (por ahora a 0)
    [JsonPropertyName("ConsumoEne")] public int? ConsumoEne { get; set; }
    [JsonPropertyName("ConsumoFeb")] public int? ConsumoFeb { get; set; }
    [JsonPropertyName("ConsumoMar")] public int? ConsumoMar { get; set; }
    [JsonPropertyName("ConsumoAbr")] public int? ConsumoAbr { get; set; }
    [JsonPropertyName("ConsumoMay")] public int? ConsumoMay { get; set; }
    [JsonPropertyName("ConsumoJun")] public int? ConsumoJun { get; set; }
    [JsonPropertyName("ConsumoJul")] public int? ConsumoJul { get; set; }
    [JsonPropertyName("ConsumoAgo")] public int? ConsumoAgo { get; set; }
    [JsonPropertyName("ConsumoSep")] public int? ConsumoSep { get; set; }
    [JsonPropertyName("ConsumoOct")] public int? ConsumoOct { get; set; }
    [JsonPropertyName("ConsumoNov")] public int? ConsumoNov { get; set; }
    [JsonPropertyName("ConsumoDic")] public int? ConsumoDic { get; set; }
    [JsonPropertyName("ConsumoTotal")] public int? ConsumoTotal { get; set; }
}
