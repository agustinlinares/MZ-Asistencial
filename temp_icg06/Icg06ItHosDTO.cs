namespace MZAsistencial.Server.DTOs
{
    public class Icg06ItHosDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        // ─── Bloque 1: Hospitalización y Consultas ───────────────────────────
        public decimal? PitrmutHos             { get; set; }
        public decimal? EsttrmutHos            { get; set; }
        public decimal? PrimConsHosProg        { get; set; }
        public decimal? PrimConsHosProgVideo   { get; set; }
        public decimal? PrimConsHosNoProg      { get; set; }
        public decimal? PrimConsHosNoProgVideo { get; set; }
        public decimal? ConssucHos             { get; set; }
        public decimal? ConssucHosVideo        { get; set; }
        public decimal? SesrehabtrmutHos       { get; set; }
        public decimal? ConsEnfHos             { get; set; }

        // ─── Bloque 2: Diagnóstico e Intervenciones ──────────────────────────
        public decimal? PradtrmutHosRm    { get; set; }
        public decimal? PradtrmutHosEco   { get; set; }
        public decimal? PradtrmutHosTac   { get; set; }
        public decimal? PradtrmutHosRadio { get; set; }
        public decimal? IquirtrmutHos     { get; set; }
        public decimal? OppracttrmutHos   { get; set; }
        public decimal? PruBiomHos        { get; set; }
        public decimal? PaurnointrmutHos  { get; set; }
    }
}
