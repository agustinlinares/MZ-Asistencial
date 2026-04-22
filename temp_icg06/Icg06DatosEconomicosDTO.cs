namespace MZAsistencial.Server.DTOs
{
    public class Icg06DatosEconomicosDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        // ─── Facturación ─────────────────────────────────────────────────────
        public decimal? Factejercsist        { get; set; }  // Facturación Entidades del sistema
        public decimal? Factejercresto       { get; set; }  // Facturación Resto concepto 327
        public decimal? FactejerotrmutuasCc  { get; set; }  // Facturación entre mutuas: CC
        public decimal? FactejerotrmutuasCp  { get; set; }  // Facturación entre mutuas: CP

        // ─── Otros costes — fila superior ────────────────────────────────────
        public decimal? Factpendcobro        { get; set; }  // Importe pendiente de cobro
        public decimal? InversionesReposicion { get; set; } // Inversiones de reposición
        public decimal? InversionesNuevas    { get; set; }  // Inversiones nuevas

        // ─── Otros costes — tabla: Gastos corrientes bienes y servicios ──────
        public decimal? GasbienescysAscp     { get; set; }  // Asist. San. C.Profes
        public decimal? GasbienescysAscc     { get; set; }  // Asist. San. C.C. (art.82)
        public decimal? GasbienescysCit      { get; set; }  // Control Adm. IT
        public decimal? GasbienescysPss      { get; set; }  // Prevención AT y EP S.S.
        public decimal? GasbienescysAg       { get; set; }  // Adm. General Mutua

        // ─── Otros costes — tabla: Gastos financieros ────────────────────────
        public decimal? GasfinAscp           { get; set; }
        public decimal? GasfinAscc           { get; set; }
        public decimal? GasfinCit            { get; set; }
        public decimal? GasfinPss            { get; set; }
        public decimal? GasfinAg             { get; set; }

        // ─── Otros costes — tabla: Amortizaciones ────────────────────────────
        public decimal? AmortizAscp          { get; set; }
        public decimal? AmortizAscc          { get; set; }
        public decimal? AmortizCit           { get; set; }
        public decimal? AmortizPss           { get; set; }
        public decimal? AmortizAg            { get; set; }
    }
}
