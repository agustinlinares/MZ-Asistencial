namespace MZAsistencial.Server.DTOs
{
    public class Icg06ConvHosDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        // ─── Bloque 1: Hospitalización y Consultas ───────────────────────────
        public decimal? PitrmutConvSecBilMultHos             { get; set; }
        public decimal? EsttrmutConvSecBilMultHos            { get; set; }
        public decimal? PrimConsConvSecBilMultHosProg        { get; set; }
        public decimal? PrimConsConvSecBilMultHosProgVideo   { get; set; }
        public decimal? PrimConsConvSecBilMultHosNoProg      { get; set; }
        public decimal? PrimConsConvSecBilMultHosNoProgVideo { get; set; }
        public decimal? ConssucConvSecBilMultHos             { get; set; }
        public decimal? ConssucConvSecBilMultHosVideo        { get; set; }
        public decimal? SrehabtrmutConvSecBilMultHos         { get; set; }
        public decimal? ConsEnfConvSecBilMultHos             { get; set; }

        // ─── Bloque 2: Diagnóstico e Intervenciones ──────────────────────────
        public decimal? PrmydtrmutConvSecBilMultHosRm    { get; set; }
        public decimal? PrmydtrmutConvSecBilMultHosEco   { get; set; }
        public decimal? PrmydtrmutConvSecBilMultHosTac   { get; set; }
        public decimal? PrmydtrmutConvSecBilMultHosRadio { get; set; }
        public decimal? IquirtrmutConvSecBilMultHos      { get; set; }
        public decimal? OpptrmutConvSecBilMultHos        { get; set; }
        public decimal? PrueBiomConvSecBilMultHos        { get; set; }
        public decimal? PaurgNoIngrConvSecBilMultHos     { get; set; }
    }
}
