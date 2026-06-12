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
        public decimal AsistenciaSanitaria { get; set; }
        public decimal IncapacidadTemp { get; set; }
        public decimal Gastos { get; set; }
        public decimal Articulo25 { get; set; }
        public decimal Total { get; set; }
        public bool Confirmar { get; set; }
    }
}