using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public interface IFicherosService
    {
        Task<IEnumerable<FicheroDTO>> GetAllAsync();
        Task<IEnumerable<AuxArea>> GetAreasAsync();
        Task<FicheroDTO> CreateAsync(string? descripcion, DateTime? fecha, int? areaId, IFormFile archivo, int usuarioId);
        Task<FicheroDTO?> UpdateAsync(int id, string? descripcion, DateTime? fecha, int? areaId, IFormFile? archivo, int usuarioId);
        Task<bool> DeleteAsync(int id, int usuarioId);
        Task<(string? filePath, string? nombreFichero)> GetFilePathAsync(int id, int usuarioId);
    }
}
