namespace MZAsistencial.Server.DTOs
{
    public class AcreditacionSectorialDTO
    {
        public int FicheroId { get; set; }
        public string? NombreFichero { get; set; }
        public string? TipoAcreditacion { get; set; }
        public string? Servicio { get; set; }
        public string? Especialidad { get; set; }
        public string? Poblacion { get; set; }
        public string? Provincia { get; set; }
        public string? Mutua { get; set; }
        public DateOnly? FechaAlta { get; set; }
        public bool Visible { get; set; }
        public string? Fichero { get; set; }
    }
}
