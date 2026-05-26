using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services;

public interface IListaDemandasService
{
    Task<IEnumerable<ListaDemandasDTO>> GetListaDemandasAsync(FiltrosListaDemandasDTO filtros, int mutuaId);
    Task<IEnumerable<object>> GetEstadosAsync();
    Task<IEnumerable<int>> GetAñosAsync();
    Task<bool> DeleteAsync(int id);
    Task<DemandaEditDTO?> GetByIdAsync(int id);
    Task<bool> UpdateAsync(int id, ActualizarDemandaDTO dto);
    Task<bool> UpdateAsync(int id, DemandaUpdateDTO dto);
}     