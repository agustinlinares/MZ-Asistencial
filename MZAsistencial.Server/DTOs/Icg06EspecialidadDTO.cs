namespace MZAsistencial.Server.DTOs
{
    public class Icg06EspecialidadDTO
    {
        public int     Id           { get; set; }
        public int     CentroId     { get; set; }
        public int     Año          { get; set; }
        public string? Servicio     { get; set; }
        public string? Especialidad { get; set; }
        public int?    Cantidad     { get; set; }
    }
}
