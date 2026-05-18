using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IAcreditacionesIndividualesService
    {
        Task<IEnumerable<AcreditacionIndividualDTO>> GetAllAsync();
        Task<int> GetMaxAñoAsync();
        Task<(string? filePath, string? nombreFichero)> GetFilePathAsync(int id);
    }
}
