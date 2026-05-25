namespace MZAsistencial.Server.DTOs
{
    public class DashboardItemDTO
    {
        public string  Titulo    { get; set; } = "";
        public decimal Respuesta { get; set; }
    }

    public class DashboardBloqueDTO
    {
        public List<DashboardItemDTO> Presupuesto  { get; set; } = new();
        public List<DashboardItemDTO> Liquidacion  { get; set; } = new();
    }

    public class DashboardDTO
    {
        public DashboardBloqueDTO CentrosPropios  { get; set; } = new();
        public DashboardBloqueDTO Conciertos      { get; set; } = new();
        public DashboardBloqueDTO OtrosConceptos  { get; set; } = new();
    }
}
