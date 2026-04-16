using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface ICentrosConcertadosService
    {
        Task<IEnumerable<CentroConcertadoCabeceraDTO>> GetCabecerasAsync();
    }
}
