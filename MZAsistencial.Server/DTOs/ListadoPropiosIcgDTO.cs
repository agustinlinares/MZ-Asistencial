namespace MZAsistencial.Server.DTOs
{
    public class ListadoPropiosIcgDTO
    {
        public int     CentroId                    { get; set; }
        public string? Localizador                 { get; set; }
        public string? Centro                      { get; set; }
        public int?    MutuaId                     { get; set; }
        public int?    Año                         { get; set; }
        public int?    IdIcg                       { get; set; }
        public decimal Cap1_GastosPersonal         { get; set; }
        public decimal Cap1Anterior_GastosPersonal { get; set; }
        public decimal Cap2_GastosCorrientes       { get; set; }
        public decimal Cap3_GastosFinancieros      { get; set; }
        public decimal Cuenta68_Amortizaciones     { get; set; }
        public decimal Art32_OtrosIngresos         { get; set; }
        public decimal Art62_InversionNueva        { get; set; }
        public decimal Art63_InversionReposicion   { get; set; }
        public decimal TotalGastos                 { get; set; }
        public decimal TotalInversion              { get; set; }
    }
}
