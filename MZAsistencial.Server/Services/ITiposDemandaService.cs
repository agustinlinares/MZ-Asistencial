using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface ITiposDemandaService
    {
        Task<IEnumerable<TipoDemandaDTO>> GetAllAsync();
        Task<IEnumerable<AuxTipoDemandaDTO>> GetAuxTiposAsync();
        Task<TipoDemandaDTO> CreateAsync(TipoDemandaDTO dto);
        Task<bool> UpdateAsync(int id, TipoDemandaDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}