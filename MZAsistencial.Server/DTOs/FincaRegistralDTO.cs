namespace MZAsistencial.Server.DTOs
{
    public class FincaRegistralDTO
    {
        public int Finca_id { get; set; }
        public int Centro_id { get; set; }
        public string? Localizador { get; set; }
        public string? Mutua { get; set; }
        public string? Centro { get; set; }
        public string? Direccion { get; set; }
        public string? CP { get; set; }
        public string? Provincia { get; set; }
        public string? Poblacion { get; set; }
        public decimal? Superficie { get; set; }
        public decimal? Coste { get; set; }
        public DateTime? F_Alquiler { get; set; }
        public string? Referencia_Catastral { get; set; }
        public DateTime? F_Inscripcion { get; set; }
        public DateTime? F_Baja { get; set; }
        public string? Mapa { get; set; }
    }
}