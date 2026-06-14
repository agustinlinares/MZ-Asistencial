using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IAcreditacionesIndividualesService
    {
        Task<IEnumerable<AcreditacionIndividualDTO>> GetAllAsync(int? mutuaId = null);
        Task<int> GetMaxAñoAsync();
        Task<(string? filePath, string? nombreFichero)> GetFilePathAsync(int id);
        Task LogAccesoAsync(int usuarioId);
    }
}
