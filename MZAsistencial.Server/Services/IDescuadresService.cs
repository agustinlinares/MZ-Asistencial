using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IDescuadresService
    {
        Task<IEnumerable<DescuadreDTO>> GetDescuadresAsync();
        Task<bool> UpsertDescuadreAsync(int mutuaId, int usuarioId, DescuadreDTO dto);
    }
}
