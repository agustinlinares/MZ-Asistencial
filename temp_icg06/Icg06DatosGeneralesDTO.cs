namespace MZAsistencial.Server.DTOs
{
    public class Icg06DatosGeneralesDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        public decimal? Nfincreg     { get; set; }  // Número de fincas registrales
        public decimal? SuptotConst  { get; set; }  // Superficie total construida
        public string?  OtrasObservac { get; set; } // Observaciones
    }
}
