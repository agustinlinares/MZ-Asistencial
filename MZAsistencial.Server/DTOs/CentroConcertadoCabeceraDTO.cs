namespace MZAsistencial.Server.DTOs
{
    public class CentroConcertadoCabeceraDTO
    {
        public string? CodigoMZ { get; set; }  
        public string? CIFNIF { get; set; }      
        public int CentroId { get; set; }
        public string? Centro { get; set; }
        public string? Direccion { get; set; }
        public string? Cp { get; set; }
        public int? PoblacionId { get; set; }   
        public string? Provincia { get; set; }  
        public DateTime? FechaAlta { get; set; }
        
        // Bloque del mapa
        public string? Latitud { get; set; }
        public string? Longitud { get; set; }
        public bool? MapaValidado { get; set; }
    }
}
