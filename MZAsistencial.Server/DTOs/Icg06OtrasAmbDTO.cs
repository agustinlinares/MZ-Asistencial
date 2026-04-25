namespace MZAsistencial.Server.DTOs
{
    public class Icg06OtrasAmbDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        public decimal? PacenArt82              { get; set; }
        public decimal? PrimConsArt82Prog        { get; set; }
        public decimal? PrimConsArt82ProgVideo   { get; set; }
        public decimal? PrimConsArt82NoProg      { get; set; }
        public decimal? PrimConsArt82NoProgVideo { get; set; }
        public decimal? ConssucArt82             { get; set; }
        public decimal? ConssucArt82Video        { get; set; }
        public decimal? SesrehabArt82            { get; set; }
        public decimal? ConsEnfArt82             { get; set; }
        public decimal? PradArt82Rm              { get; set; }
        public decimal? PradArt82Eco             { get; set; }
        public decimal? PradArt82Tac             { get; set; }
        public decimal? PradArt82Radio           { get; set; }
        public decimal? IquircenArt82            { get; set; }
        public decimal? OppractArt82             { get; set; }
        public decimal? PruBiomArt82             { get; set; }
    }
}
