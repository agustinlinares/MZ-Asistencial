using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public interface IExportarAccessService
    {
        Task<IEnumerable<FicheroGeneradoDTO>> GetAllAsync();
        Task<IEnumerable<Mutua>> GetMutuasAsync();
        Task<IEnumerable<int>> GetAñosAsync();
        Task<FicheroGeneradoDTO> CreateAsync(int mutuaIntId, int año, int tipoCentroId, int usuarioId);
        Task<bool> DeleteAsync(int id, int usuarioId);
        Task<(string? filePath, string? nombreFichero)> GetFilePathAsync(int id);
        Task LogAccesoAsync(int usuarioId);
        Task LogExportacionExcelAsync(int usuarioId);
    }
}
