using System.Text.Json.Serialization;

namespace MZAsistencial.Server.DTOs
{
    public class FincaCosteDTO
    {
        [JsonPropertyName("Id")]
        public int Id { get; set; }
        [JsonPropertyName("FincaId")]
        public int FincaId { get; set; }
        [JsonPropertyName("Localizador")]
        public string? Localizador { get; set; }
        [JsonPropertyName("Anio")]
        public int Anio { get; set; }
        [JsonPropertyName("Coste")]
        public double? Coste { get; set; }
    }
}
