namespace MZAsistencial.Server.DTOs
{
    public class Icg06DatosEconomicosDTO
    {
        public int  IdIcg    { get; set; }
        public int? CentroId { get; set; }
        public int? Año      { get; set; }

        // ─── Gastos financiación ──────────────────────────────────────────────
        public decimal? GasfinAscp { get; set; }   // Gastos financiación ASCP
        public decimal? GasfinAscc { get; set; }   // Gastos financiación ASCC
        public decimal? GasfinCit  { get; set; }   // Gastos financiación CIT
        public decimal? GasfinPss  { get; set; }   // Gastos financiación PSS
        public decimal? GasfinAg   { get; set; }   // Gastos financiación AG

        // ─── Bienes corrientes y servicios ────────────────────────────────────
        public decimal? GasbienescysAscp { get; set; }
        public decimal? GasbienescysAscc { get; set; }
        public decimal? GasbienescysCit  { get; set; }
        public decimal? GasbienescysPss  { get; set; }
        public decimal? GasbienescysAg   { get; set; }

        // ─── Amortizaciones ───────────────────────────────────────────────────
        public decimal? AmortizAscp { get; set; }
        public decimal? AmortizAscc { get; set; }
        public decimal? AmortizCit  { get; set; }
        public decimal? AmortizPss  { get; set; }
        public decimal? AmortizAg   { get; set; }

        // ─── Inversiones ──────────────────────────────────────────────────────
        public decimal? InversionesNuevas      { get; set; }   // Inversiones nuevas
        public decimal? InversionesReposicion  { get; set; }   // Inversiones reposición

        // ─── Facturación ──────────────────────────────────────────────────────
        public decimal? Factejercsist        { get; set; }   // Facturación ejercicio sistema
        public decimal? Factejercresto       { get; set; }   // Facturación ejercicio resto
        public decimal? FactejerotrmutuasCp  { get; set; }   // Facturación otras mutuas CP
        public decimal? FactejerotrmutuasCc  { get; set; }   // Facturación otras mutuas CC
        public decimal? Factpendcobro        { get; set; }   // Facturación pendiente cobro
    }
}
