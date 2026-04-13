using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IDescuadresService
    {
        Task<IEnumerable<DescuadreDTO>> GetDescuadresAsync();
    }
}