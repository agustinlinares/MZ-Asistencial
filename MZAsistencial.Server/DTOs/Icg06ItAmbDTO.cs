namespace MZAsistencial.Server.DTOs
{
    public class Icg06ItAmbDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        public decimal? PaotmutArt12                { get; set; }
        public decimal? PrimConsotmutArt12Prog       { get; set; }
        public decimal? PrimConsotmutArt12ProgVideo  { get; set; }
        public decimal? PrimConotmutArt12NoProg      { get; set; }
        public decimal? PrimConotmutArt12NoProgVideo { get; set; }
        public decimal? ConssucotmutArt12            { get; set; }
        public decimal? ConssucotmutArt12Video       { get; set; }
        public decimal? ConsEnfotmutArt12            { get; set; }
        public decimal? PradotmutArt12Rm             { get; set; }
        public decimal? PradotmutArt12Eco            { get; set; }
        public decimal? PradotmutArt12Tac            { get; set; }
        public decimal? PradotmutArt12Radio          { get; set; }
        public decimal? IquirotmutArt12              { get; set; }
        public decimal? OppractotmutArt12            { get; set; }
        public decimal? SesrehabotmutArt12           { get; set; }
        public decimal? PruBiomotmutArt12            { get; set; }
    }
}
