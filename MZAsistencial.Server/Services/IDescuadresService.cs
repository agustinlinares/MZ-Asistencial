using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IDescuadresService
    {
        Task<IEnumerable<DescuadreDTO>> RecalcularYObtenerDescuadresAsync(int usuarioId, int mutuaIdSesion, int anio);
        Task<bool> UpsertDescuadreAsync(int mutuaId, int usuarioId, DescuadreDTO dto);
    }
}
