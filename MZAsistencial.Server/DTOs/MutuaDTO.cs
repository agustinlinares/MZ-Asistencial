namespace MZAsistencial.Server.DTOs
{
    public class MutuaDTO
    {
        public int NumeroId { get; set; }        // Nº  (NumeroMutua)
        public string? Mutua { get; set; }      // Mutua
        public string? Direccion { get; set; }  // Dirección
        public string? CP { get; set; }         // C.P
        public string? Poblacion { get; set; }  // Población
        public int? PoblacionId { get; set; }
        public string? Provincia { get; set; }  // Provincia

        public string? NumeroMutua { get; set; }
        public string? RazonSocial { get; set; }
        public string? Telefono { get; set; }
        public string? Fax { get; set; }
        public string? DireccionElectronica { get; set; }
        public string? PersonaContacto { get; set; }

        //Usuario para el registro de actividad
        public int? UsuarioId { get; set; }


    }
}
