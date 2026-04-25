namespace MZAsistencial.Server.DTOs
{
    public class RegistroICGDTO
    {
        public int    IdICG              { get; set; }
        public int?   Ano                { get; set; }
        public int?   CentroId           { get; set; }
        public string? Mutua             { get; set; }
        public string? Centro            { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int?   UsuarioModificacionId { get; set; }
    }
}
