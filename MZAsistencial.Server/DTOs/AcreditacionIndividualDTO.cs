namespace MZAsistencial.Server.DTOs
{
    public class AcreditacionIndividualDTO
    {
        public int FicheroId { get; set; }
        public string? NombreFichero { get; set; }
        public string? Servicio { get; set; }
        public string? Especialidad { get; set; }
        public string? Poblacion { get; set; }
        public string? Provincia { get; set; }
        public string? Mutua { get; set; }
        public int? DemandaId { get; set; }
        public DateOnly? FechaAlta { get; set; }
        public int? Año { get; set; }
        public string? Fichero { get; set; }
    }
}
