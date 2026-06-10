namespace MZAsistencial.Server.DTOs
{
    public class Icg06AreaAsistencialDTO
    {
        public int  IdIcg       { get; set; }
        public int? CentroId    { get; set; }
        public int? Año         { get; set; }
        public string? HorarioDe    { get; set; }
        public string? HorarioA     { get; set; }
        public int?    TipoHorario  { get; set; }
        public string? Numdiano     { get; set; }
        public string? Numdcierre   { get; set; }
        public string? Numquirof    { get; set; }
        public string? Numcamas     { get; set; }
        public string? TraslNdirec  { get; set; }
        public string? Hormande     { get; set; }
        public string? Hormanha     { get; set; }
        public string? Hortardes    { get; set; }
        public string? Hortarhas    { get; set; }
    }
}