namespace MZAsistencial.Server.DTOs
{
    public class AcuerdosProvinciaDTO
    {
        public int? NumProvincia { get; set; }
        public string? Provincia { get; set; }
        public int? NumServicios { get; set; }
        public decimal? ContraprestacionEconomica { get; set; }
        public int? NumServiciosTerceros { get; set; }
        public decimal? ContraprestacionEconomicaTerceros { get; set; }
    }
}