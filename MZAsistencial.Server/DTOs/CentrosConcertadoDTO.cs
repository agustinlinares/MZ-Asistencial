using System;

namespace MZAsistencial.Server.DTOs
{
    public class CentrosConcertadoDTO
    {
        public string? Ccn { get; set; }
        public string? Cif { get; set; }
        public int Centro_id { get; set; }
        public string? Centro { get; set; }
        public string? Direccion { get; set; }
        public string? CP { get; set; }
        public string? Poblacion { get; set; }
        public string? Provincia { get; set; }
        public DateTime? FechaAlta { get; set; }
        public string? Mapa { get; set; }
    }
}
