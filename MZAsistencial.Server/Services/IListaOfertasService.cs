using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services;

public interface IListaOfertasService
{
    Task<IEnumerable<ListaOfertasDTO>> GetListaOfertasAsync(FiltrosListaOfertasDTO filtros, int mutuaId);
    Task<IEnumerable<object>> GetEstadosAsync();
    Task<IEnumerable<int>> GetAñosAsync();
}