namespace MZAsistencial.Server.DTOs
{
    public class Icg06PoblacionProtegidaDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        // ─── A efectos administrativos ───────────────────────────────────────
        public decimal? Pobpr25kmAd    { get; set; }  // En un radio de 25 km
        public decimal? Pobpr50kmAd    { get; set; }  // En un radio de 50 km
        public decimal? Pobprmas50Ad   { get; set; }  // En un radio de más de 50 km
        // Total = suma de los 3 anteriores (calculado en frontend)

        // ─── Poblaciones limítrofes (administrativos) ────────────────────────
        public string?  Obs25kmAd      { get; set; }  // En un radio de 25 km
        public string?  Obs50kmAd      { get; set; }  // En un radio de 50 km
        public string?  Obsmas50kmAd   { get; set; }  // En un radio de más de 50 km

        // ─── A efectos sanitarios. Por conting. profesionales ────────────────
        public decimal? Pobpr25kmCp    { get; set; }  // En un radio de 25 km
        public decimal? Pobpr50kmCp    { get; set; }  // En un radio de 50 km
        public decimal? Pobprmas50Cp   { get; set; }  // En un radio de más de 50 km
        // Total = suma de los 3 anteriores (calculado en frontend)

        // ─── A efectos sanitarios. Por IT conting. comunes ───────────────────
        public decimal? Pobpr25kmItcc  { get; set; }  // En un radio de 25 km
        public decimal? Pobpr50kmItcc  { get; set; }  // En un radio de 50 km
        public decimal? Pobprmas50Itcc { get; set; }  // En un radio de más de 50 km
        // Total = suma de los 3 anteriores (calculado en frontend)

        // ─── Poblaciones limítrofes (sanitarios) ─────────────────────────────
        public string?  Obs25km        { get; set; }  // En un radio de 25 km
        public string?  Obs50km        { get; set; }  // En un radio de 50 km
        public string?  Obsmas50km     { get; set; }  // En un radio de más de 50 km
    }
}
