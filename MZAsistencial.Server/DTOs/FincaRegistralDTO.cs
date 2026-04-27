using System.Text.Json.Serialization;

namespace MZAsistencial.Server.DTOs
{
    public class FincaRegistralDTO
    {
        [JsonPropertyName("Finca_id")]
        public int Finca_id { get; set; }
        [JsonPropertyName("Centro_id")]
        public int Centro_id { get; set; }
        [JsonPropertyName("Localizador")]
        public string? Localizador { get; set; }
        [JsonPropertyName("Mutua")]
        public string? Mutua { get; set; }
        [JsonPropertyName("Centro")]
        public string? Centro { get; set; }
        [JsonPropertyName("Direccion")]
        public string? Direccion { get; set; }
        [JsonPropertyName("CP")]
        public string? CP { get; set; }
        [JsonPropertyName("Provincia")]
        public string? Provincia { get; set; }
        [JsonPropertyName("Poblacion")]
        public string? Poblacion { get; set; }
        [JsonPropertyName("Utilizacion")]
        public string? Utilizacion { get; set; }
        [JsonPropertyName("Superficie")]
        public decimal? Superficie { get; set; }
        [JsonPropertyName("Coste")]
        public decimal? Coste { get; set; }
        [JsonPropertyName("F_Alquiler")]
        public DateTime? F_Alquiler { get; set; }
        [JsonPropertyName("Referencia_Catastral")]
        public string? Referencia_Catastral { get; set; }
        [JsonPropertyName("F_Inscripcion")]
        public DateTime? F_Inscripcion { get; set; }
        [JsonPropertyName("F_Baja")]
        public DateTime? F_Baja { get; set; }
        [JsonPropertyName("Mapa")]
        public string? Mapa { get; set; }
        [JsonPropertyName("TipoFinca")]
        public int? TipoFinca { get; set; }
        [JsonPropertyName("Titularidad")]
        public string? Titularidad { get; set; }
        [JsonPropertyName("OtrosDatos")]
        public string? OtrosDatos { get; set; }
        [JsonPropertyName("DireccionGoogle")]
        public string? DireccionGoogle { get; set; }

        [JsonPropertyName("Latitud")]
        public string? Latitud { get; set; }

        [JsonPropertyName("Longitud")]
        public string? Longitud { get; set; }
    }
}