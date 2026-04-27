namespace MZAsistencial.Server.DTOs
{
    public class IcgConciertoDto
    {
        public int Id_Icg { get; set; }
        public string Localizador { get; set; } = string.Empty;
        public int Concierto_id { get; set; }
        public string CodCASA { get; set; } = string.Empty;
        public string Mutua { get; set; } = string.Empty;
        public int Centro_id { get; set; }
        public string Centro { get; set; } = string.Empty;
        public string Poblacion { get; set; } = string.Empty;
        public string Provincia { get; set; } = string.Empty;
        public string AsistenciaSanitaria { get; set; } = string.Empty;
        public string IncapacidadTemp { get; set; } = string.Empty;
        public decimal Gastos { get; set; }
        public string Articulo25 { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public bool Confirmar { get; set; }
    }
}