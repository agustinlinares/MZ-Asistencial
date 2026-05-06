namespace MZAsistencial.Server.DTOs
{
    public class Icg06AreaAsistencialDTO
    {
        public int  IdIcg    { get; set; }
        public int? CentroId { get; set; }
        public int? Año      { get; set; }

        // Horarios
        public string? HorarioDe    { get; set; }   // Horario desde
        public string? HorarioA     { get; set; }   // Horario hasta
        public int?    TipoHorario  { get; set; }   // Tipo de horario

        // Días
        public string? Numdiano     { get; set; }   // Nº días no laborables
        public string? Numdcierre   { get; set; }   // Nº días de cierre

        // Instalaciones
        public string? Numquirof    { get; set; }   // Nº quirófanos
        public string? Numcamas     { get; set; }   // Nº camas

        // Traslados
        public string? TraslNdirec  { get; set; }   // Traslado / Nueva dirección
    }
}
