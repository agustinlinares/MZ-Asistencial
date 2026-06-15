namespace MZAsistencial.Server.DTOs
{
    public class FicheroDTO
    {
        public int FicheroId { get; set; }
        public string? NombreFichero { get; set; }
        public string? Descripcion { get; set; }
        public int? UsuarioId { get; set; }
        public string? Usuario { get; set; }
        public DateTime? Fecha { get; set; }
        public int? AreaId { get; set; }
        public string? Area { get; set; }
        public DateTime? FechaAlta { get; set; }
        public int? UsuarioAltaId { get; set; }
    }
}
