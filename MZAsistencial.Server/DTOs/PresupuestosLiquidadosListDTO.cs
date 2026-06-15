namespace MZAsistencial.Server.DTOs
{
    public class PresupuestosLiquidadosListDTO
    {
        public int IdPresupuesto { get; set; }
        public string Año { get; set; } = null!;
        public int MutuaId { get; set; }
        public string MutuaNombre { get; set; } = null!;
        public double TotalCentrosPropios { get; set; }
        public double TotalCentrosConcertados { get; set; }
        public double TotalOtrosConceptos { get; set; }
        public double TotalGeneral { get; set; }
    }
}