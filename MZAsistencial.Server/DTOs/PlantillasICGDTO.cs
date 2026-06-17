using System;
using System.Text.Json.Serialization;

namespace MZAsistencial.Server.DTOs;

public class PlantillasICGDTO
{
    [JsonPropertyName("Id")]
    public int Id { get; set; }
    
    [JsonPropertyName("Informe")]
    public string? Informe { get; set; }
    
    [JsonPropertyName("ResultadoInforme")]
    public string? ResultadoInforme { get; set; }
    
    [JsonPropertyName("EstadoInforme")]
    public string? EstadoInforme { get; set; }
    
    [JsonPropertyName("TipoICG")]
    public string? TipoICG { get; set; }
    
    [JsonPropertyName("Mutua")]
    public string? Mutua { get; set; }
    
    [JsonPropertyName("Anio")]
    public int? Anio { get; set; }
    
    [JsonPropertyName("Mes")]
    public int? Mes { get; set; }
    
    [JsonPropertyName("Usuario")]
    public string? Usuario { get; set; }
    
    [JsonPropertyName("FechaAlta")]
    public DateTime? FechaAlta { get; set; }
}
