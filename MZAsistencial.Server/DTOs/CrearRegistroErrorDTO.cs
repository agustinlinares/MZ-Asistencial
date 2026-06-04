namespace MZAsistencial.Server.DTOs
{
    public class CrearRegistroErrorDTO
    {
        public string Descripcion { get; set; } = string.Empty;
        public string Modulo { get; set; } = "React Client";
        public int? UsuarioId { get; set; }
        public string? DetalleError { get; set; }
        public string? Comentarios { get; set; }
    }
}