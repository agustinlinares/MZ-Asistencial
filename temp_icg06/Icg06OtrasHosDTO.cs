namespace MZAsistencial.Server.DTOs
{
    public class Icg06OtrasHosDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        // ─── Bloque 1: Hospitalización y Consultas ───────────────────────────
        public decimal? PitrmutArt82Hos             { get; set; }
        public decimal? EsttrmutArt82Hos            { get; set; }
        public decimal? PrimConsArt82HosProg        { get; set; }
        public decimal? PrimConsArt82HosProgVideo   { get; set; }
        public decimal? PrimConsArt82HosNoProg      { get; set; }
        public decimal? PrimConsArt82HosNoProgVideo { get; set; }
        public decimal? ConssucArt82Hos             { get; set; }
        public decimal? ConssucArt82HosVideo        { get; set; }
        public decimal? SrehabtrmutArt82Hos         { get; set; }
        public decimal? ConsEnfArt82Hos             { get; set; }

        // ─── Bloque 2: Diagnóstico e Intervenciones ──────────────────────────
        public decimal? PrmydtrmutArt82HosRm    { get; set; }
        public decimal? PrmydtrmutArt82HosEco   { get; set; }
        public decimal? PrmydtrmutArt82HosTac   { get; set; }
        public decimal? PrmydtrmutArt82HosRadio { get; set; }
        public decimal? IquirtrmutArt82Hos      { get; set; }
        public decimal? OpptrmutArt82Hos        { get; set; }
        public decimal? PrueBiomArt82Hos        { get; set; }
        public decimal? PaurgNoIngrArt82Hos     { get; set; }
    }
}
