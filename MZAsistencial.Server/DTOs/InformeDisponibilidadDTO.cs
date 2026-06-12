namespace MZAsistencial.Server.DTOs
{
    public class InformeDisponibilidadDTO
    {
        public string? Provincia    { get; set; }
        public string? Localidad    { get; set; }
        public string? Especialidad { get; set; }
        public string? Servicio     { get; set; }
        public int PendienteEnero      { get; set; }
        public int PendienteFebrero    { get; set; }
        public int PendienteMarzo      { get; set; }
        public int PendienteAbril      { get; set; }
        public int PendienteMayo       { get; set; }
        public int PendienteJunio      { get; set; }
        public int PendienteJulio      { get; set; }
        public int PendienteAgosto     { get; set; }
        public int PendienteSeptiembre { get; set; }
        public int PendienteOctubre    { get; set; }
        public int PendienteNoviembre  { get; set; }
        public int PendienteDiciembre  { get; set; }
        public int PendienteTotal      { get; set; }
    }
}
