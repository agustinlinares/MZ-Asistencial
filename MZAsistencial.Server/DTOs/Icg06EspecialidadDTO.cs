namespace MZAsistencial.Server.DTOs
{
    public class Icg06EspecialidadDTO
    {
        public int     Id           { get; set; }
        public int     CentroId     { get; set; }
        public int     Año          { get; set; }
        public int     EspecialidadId { get; set; }
        public string? Especialidad  { get; set; }
        public string? Servicio      { get; set; }
        public int?    Cantidad      { get; set; }
        public double? ImporteConIva { get; set; }
        public DateTime? FechaAlta  { get; set; }
        public int?    Disponibilidad { get; set; }
    }
}