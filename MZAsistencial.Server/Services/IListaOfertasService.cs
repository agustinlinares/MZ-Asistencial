using MZAsistencial.Server.DTOs;





namespace MZAsistencial.Server.Services;





public interface IListaOfertasService


{


    Task<IEnumerable<ListaOfertasDTO>> GetListaOfertasAsync(FiltrosListaOfertasDTO filtros, int mutuaId);


    Task<IEnumerable<object>> GetEstadosAsync();


    Task<IEnumerable<int>> GetAnosAsync();


    Task<OfertaEditDTO?> GetByIdAsync(int id);


    Task<bool> UpdateAsync(int id, OfertaEditDTO dto);


    Task<bool> DeleteAsync(int id);


}