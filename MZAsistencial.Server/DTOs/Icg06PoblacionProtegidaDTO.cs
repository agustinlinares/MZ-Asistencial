namespace MZAsistencial.Server.DTOs
{
    public class Icg06PoblacionProtegidaDTO
    {
        public int  IdIcg    { get; set; }
        public int? CentroId { get; set; }
        public int? Año      { get; set; }

        // ─── Asistencia Directa (AD) ─────────────────────────────────────────
        public decimal? Pobpr25kmAd   { get; set; }   // Población ≤25km AD
        public decimal? Pobpr50kmAd   { get; set; }   // Población ≤50km AD
        public decimal? Pobprmas50Ad  { get; set; }   // Población >50km AD
        public string?  Obs25kmAd     { get; set; }   // Observaciones ≤25km AD
        public string?  Obs50kmAd     { get; set; }   // Observaciones ≤50km AD
        public string?  Obsmas50kmAd  { get; set; }   // Observaciones >50km AD

        // ─── Centros Propios (CP) ─────────────────────────────────────────────
        public decimal? Pobpr25kmCp   { get; set; }   // Población ≤25km CP
        public decimal? Pobpr50kmCp   { get; set; }   // Población ≤50km CP
        public decimal? Pobprmas50Cp  { get; set; }   // Población >50km CP

        // ─── IT / CC (ITCC) ──────────────────────────────────────────────────
        public decimal? Pobpr25kmItcc  { get; set; }  // Población ≤25km ITCC
        public decimal? Pobpr50kmItcc  { get; set; }  // Población ≤50km ITCC
        public decimal? Pobprmas50Itcc { get; set; }  // Población >50km ITCC

        // ─── Observaciones generales ─────────────────────────────────────────
        public string?  Obs25km    { get; set; }      // Observaciones ≤25km
        public string?  Obs50km    { get; set; }      // Observaciones ≤50km
        public string?  Obsmas50km { get; set; }      // Observaciones >50km
    }
}
