namespace MZAsistencial.Server.DTOs
{
    public class MutuaAsignadaDTO
    {
        public int MutuaId { get; set; }
        public string? Mutua { get; set; }
        
        // Estos dos campos vienen de la tabla Conciertos
        public string? CodigoCasa { get; set; }
        public string? Localizador { get; set; }
    }
}