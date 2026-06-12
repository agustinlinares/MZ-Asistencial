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

        public int? ProvinciaId { get; set; }
        public int? PoblacionId { get; set; }
        public int? ProveedorId { get; set; }
        public int? DelegacionId { get; set; }

        public string? Telefono { get; set; }
        public DateTime? FechaAlta { get; set; }
        public DateTime? FechaBaja { get; set; }
        public string? Latitud { get; set; }
        public string? Longitud { get; set; }
        
        public bool? MapaValidado { get; set; }
        public string? Numero { get; set; }
        public long? NumRegistroSanitario { get; set; } 
        public string? Comentarios { get; set; }
        public string? MotivoBaja { get; set; }

    }
}