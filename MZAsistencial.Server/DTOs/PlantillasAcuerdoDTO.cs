using System;

namespace MZAsistencial.Server.DTOs
{
    public class PlantillasAcuerdosDTO
    {
        public string? Informe { get; set; }
        public string? EstadoInforme { get; set; }
        public string? TipoAcuerdo { get; set; }
        public string? Mutua { get; set; }
        public int? Año { get; set; }
        public int? Mes { get; set; }
        public string? Usuario { get; set; }
        public DateTime? FechaAlta { get; set; }
    }
}
