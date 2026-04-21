namespace MZAsistencial.Server.DTOs
{
    public class AcuerdosTipoServicioDTO
    {
        public string? TipoServicio { get; set; }
        public string? TipoServicioNombre { get; set; }
        public int? NumServicios { get; set; }
        public decimal? ContraprestacionEconomica { get; set; }
        public int? NumServiciosTerceros { get; set; }
        public decimal? ContraprestacionEconomicaTerceros { get; set; }
    }
}