namespace MZAsistencial.Server.DTOs
{
    public class Icg06EspecialidadDTO
    {
        public int       Id                            { get; set; }
        public int       CentroId                      { get; set; }
        public int       Año                           { get; set; }
        public int       EspecialidadId                { get; set; }
        public string?   Servicio                      { get; set; }
        public int?      Cantidad                      { get; set; }
        public float?    ImporteConIva                 { get; set; }
        public long?     ServicioId                    { get; set; }
        public DateTime? FechaAlta                     { get; set; }
        public DateTime? FechaBaja                     { get; set; }
        public int?      Disponibilidad                { get; set; }
        public int?      Plazo                         { get; set; }
        public int?      ActualizarDisponibilidad      { get; set; }
        public DateTime? FechaModificacion             { get; set; }
        public DateTime? FechaActualizarDisponibilidad { get; set; }
        public DateTime? FechaGeneracionAcreditacion   { get; set; }
    }
}