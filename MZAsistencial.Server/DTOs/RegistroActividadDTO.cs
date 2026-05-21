using System;

namespace MZAsistencial.Server.DTOs
{
    public class RegistroActividadDTO
    {
        public int RegistroId { get; set; }
        public string? Mutua { get; set; }
        public string? Usuario { get; set; }
        public DateTime? Fecha { get; set; }
        public string? Accion { get; set; }
        public string? Sql { get; set; }
    }
}
