namespace MZAsistencial.Server.DTOs
{
    public class Icg06AsProDTO
    {
        public int      IdIcg    { get; set; }
        public int      Año      { get; set; }
        public int      CentroId { get; set; }

        // ─── Fechas ──────────────────────────────────────────────────────────
        public DateTime? Actidesde { get; set; }
        public DateTime? Actihasta { get; set; }

        // ─── Fila 1: En el centro (solo diag/rehab/enf/interv) ──────────────
        public decimal? SesrehabtrmutCentro   { get; set; }  // Sesrehabtrmut
        public decimal? ConsEnftrmutCentro     { get; set; }  // ConsEnftrmut
        public decimal? PradtrmutRm            { get; set; }
        public decimal? PradtrmutEco           { get; set; }
        public decimal? PradtrmutTac           { get; set; }
        public decimal? PradtrmutRadio         { get; set; }
        public decimal? Iquirtrmut             { get; set; }
        public decimal? Otrpptrmut             { get; set; }
        public decimal? PruBiomtrmut           { get; set; }

        // ─── Fila 2: Radio 25 km ─────────────────────────────────────────────
        public string?  Pacen25km              { get; set; }
        public string?  PrimConsProg25km       { get; set; }
        public string?  PrimConsProgVideo25km  { get; set; }
        public decimal? PrimConsNoProg25km     { get; set; }
        public decimal? PrimConsNoProgVideo25km{ get; set; }
        public string?  Conssuc25km            { get; set; }
        public string?  Conssuc25kmVideo       { get; set; }

        // ─── Fila 3: Radio 50 km ─────────────────────────────────────────────
        public string?  Pacen50km              { get; set; }
        public string?  PrimConsProg50km       { get; set; }
        public string?  PrimConsProgVideo50km  { get; set; }
        public decimal? PrimConsNoProg50km     { get; set; }
        public decimal? PrimConsNoProgVideo50km{ get; set; }
        public string?  Conssuc50km            { get; set; }
        public string?  Conssuc50kmVideo       { get; set; }

        // ─── Fila 4: Más de 50 km ────────────────────────────────────────────
        public string?  Pacen50km1              { get; set; }
        public string?  PrimConsProg50km1       { get; set; }
        public string?  PrimConsProgVideo50km1  { get; set; }
        public decimal? PrimConsNoProg50km1     { get; set; }
        public decimal? PrimConsNoProgVideo50km1{ get; set; }
        public string?  Conssuc50km1            { get; set; }
        public string?  Conssuc50km1Video       { get; set; }

        // ─── Fila 5: Total ───────────────────────────────────────────────────
        public decimal? NumPersAtendTotalTraMut { get; set; }
        public decimal? PrimConsotmutArt12Prog       { get; set; }
        public decimal? PrimConsotmutArt12ProgVideo  { get; set; }
        public decimal? PrimConotmutArt12NoProg      { get; set; }
        public decimal? PrimConotmutArt12NoProgVideo { get; set; }
        public decimal? ConssucotmutArt12            { get; set; }
        public decimal? ConssucotmutArt12Video       { get; set; }
        public decimal? SesrehabotmutArt12           { get; set; }
        public decimal? ConsEnfotmutArt12            { get; set; }
        public decimal? PradotmutArt12Rm             { get; set; }
        public decimal? PradotmutArt12Eco            { get; set; }
        public decimal? PradotmutArt12Tac            { get; set; }
        public decimal? PradotmutArt12Radio          { get; set; }
        public decimal? IquirotmutArt12              { get; set; }
        public decimal? OppractotmutArt12            { get; set; }
        public decimal? PruBiomotmutArt12            { get; set; }
    }
}
