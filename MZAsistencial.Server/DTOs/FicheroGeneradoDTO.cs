namespace MZAsistencial.Server.DTOs
{
    public class FicheroGeneradoDTO
    {
        public int FicheroGeneradoId { get; set; }
        public string? MutuaId { get; set; }
        public string? NumeroMutua { get; set; }
        public string? NombreMutua { get; set; }
        public int? Año { get; set; }
        public string? NombreFichero { get; set; }
        public int? UsuarioAltaId { get; set; }
        public string? UsuarioAlta { get; set; }
        public DateTime? FechaAlta { get; set; }
        public int? HoraAlta { get; set; }
        public int? EstadoId { get; set; }
        public string? Estado { get; set; }
        public int? TipoCentroId { get; set; }
        public string? TipoCentro { get; set; }
        public int? TipoConciertoId { get; set; }
    }
}
