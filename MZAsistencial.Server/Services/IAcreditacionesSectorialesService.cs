using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IAcreditacionesSectorialesService
    {
        Task<IEnumerable<AcreditacionSectorialDTO>> GetAllAsync();
        Task<(string? filePath, string? nombreFichero)> GetFilePathAsync(int id);
        Task<(int? ficheroId, string message)> CreateTestRecordAsync();
    }
}
