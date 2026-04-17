using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IAcuerdosBIService
    {
        Task<IEnumerable<AcuerdosMutuaDTO>> GetMutuasOfertaAsync(int mutuaId, int anio);
        Task<IEnumerable<AcuerdosMutuaDTO>> GetMutuasDemandaAsync(int mutuaId, int anio);
        Task<IEnumerable<AcuerdosProvinciaDTO>> GetProvinciasOfertaAsync(int mutuaId, int anio);
        Task<IEnumerable<AcuerdosProvinciaDTO>> GetProvinciasDemandaAsync(int mutuaId, int anio);
        Task<IEnumerable<AcuerdosTipoServicioDTO>> GetTipoServicioOfertaAsync(int mutuaId, int anio);
        Task<IEnumerable<AcuerdosTipoServicioDTO>> GetTipoServicioDemandaAsync(int mutuaId, int anio);
    }
}