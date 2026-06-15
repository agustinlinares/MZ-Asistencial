namespace MZAsistencial.Server.DTOs
{
    public class TipoAsistenciaDTO
    {
        public int TipoAsistenciaId { get; set; }
        public string? Descripcion { get; set; }
        public int Año { get; set; } 
    }

    public class CentroAdhesionDTO
    {
        public int ConciertoId { get; set; }
        public string? CodigoCasa { get; set; }
        public string? CentroNombre { get; set; }
        public string? MutuaNombre { get; set; }
    }
}