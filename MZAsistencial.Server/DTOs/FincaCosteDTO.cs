namespace MZAsistencial.Server.DTOs
{
    public class FincaCosteDTO
    {
        public int Id { get; set; }
        public int FincaId { get; set; }
        public string? Localizador { get; set; }
        public int Año { get; set; }
        public double? Coste { get; set; }
    }
}
