using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IPlantillasAcuerdoService
    {
        Task<IEnumerable<PlantillasAcuerdosDTO>> GetPlantillasAcuerdosAsync();
        Task<bool> CreatePlantillaAcuerdoAsync(PlantillasAcuerdosDTO dto);
        Task<bool> UpdatePlantillaAcuerdoAsync(int id, PlantillasAcuerdosDTO dto);
        Task<bool> DeletePlantillaAcuerdoAsync(int id);
    }
}
