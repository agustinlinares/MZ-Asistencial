using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IMutuasService
    {
        Task<IEnumerable<MutuaDTO>> GetMutuasAsync();
    }
}