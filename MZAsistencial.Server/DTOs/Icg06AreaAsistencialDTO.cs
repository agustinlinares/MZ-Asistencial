namespace MZAsistencial.Server.DTOs
{
    public class Icg06AreaAsistencialDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        // ─── Datos de funcionamiento ─────────────────────────────────────────
        public int?    TipoHorario  { get; set; }   // 0=Interrumpido, 1=Ininterrumpido
        public string? HorarioA    { get; set; }   // Horario de
        public string? HorarioDe   { get; set; }   // Horario a
        public string? TraslNdirec { get; set; }   // Traslado: Nueva dirección
        public string? Numdiano    { get; set; }   // Nº días apertura al año
        public string? Numdcierre  { get; set; }   // Nº días cierre al año

        // ─── Equipamiento ────────────────────────────────────────────────────
        public string? Numquirof   { get; set; }   // Número de quirófanos
        public string? Numcamas    { get; set; }   // Número de camas hospitalarias
    }
}
