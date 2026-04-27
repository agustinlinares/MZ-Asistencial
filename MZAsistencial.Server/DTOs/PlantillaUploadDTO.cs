using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace MZAsistencial.Server.DTOs
{
    public class PlantillaUploadDTO
    {
        [Required]
        public IFormFile File { get; set; } = null!;
        public string? Mutua { get; set; }
        public int? Año { get; set; }
        public int? TipoAcuerdoId { get; set; }
        public int? Mes { get; set; }
        public string? Usuario { get; set; }
    }
}
