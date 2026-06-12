namespace MZAsistencial.Server.DTOs
{
    public class DescuadreDTO
    {
        public int  MutuaId             { get; set; }
        public int? UsuarioId           { get; set; }
        public string? Mutua            { get; set; }
        public decimal? GastoPersonal   { get; set; }
        public decimal? GastoCorrientes { get; set; }
        public decimal? GastosFinancieros { get; set; }
        public decimal? Amortizacion    { get; set; }
        public decimal? TotalCostePropios { get; set; }
        public decimal? CosteConciertos { get; set; }
        public decimal? Aplicacion2581  { get; set; }
        public decimal? Aplicacion2582  { get; set; }
        public decimal? RestoArt25      { get; set; }
        public decimal? TotalArticulo25 { get; set; }
        public decimal? InversionNueva  { get; set; }
        public decimal? Reposicion      { get; set; }
        public decimal? IngresosServicios { get; set; }
        public decimal? TotalOtrosConceptos { get; set; }
        public decimal? TotalGeneral    { get; set; }
        public int? PropiosConf         { get; set; }
        public int? PropiosNoConf       { get; set; }
        public int? ConcertConf         { get; set; }
        public int? ConcertNoConf       { get; set; }
    }
}
