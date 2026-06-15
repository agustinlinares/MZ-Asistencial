namespace MZAsistencial.Server.DTOs
{
    public class TipoDemandaDTO
    {
        public int TipoDemandaId { get; set; }
        public int Año { get; set; }
        public string Nombre { get; set; } = null!;
        public DateOnly PeriodoDesde { get; set; }
        public DateOnly PeriodoHasta { get; set; }
        public bool Activo { get; set; }
        public int? TipoId { get; set; }
        public string? TipoDescripcion { get; set; }
    }
}