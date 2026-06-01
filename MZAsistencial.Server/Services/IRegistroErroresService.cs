using System;
using System.Linq;
using System.Threading.Tasks;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IRegistroErroresService
    {
        Task LogErrorAsync(Exception ex, string modulo, int? usuarioId = null);
        Task LogErrorStringAsync(string descripcion, string modulo, int? usuarioId = null, string? stackTrace = null);
        IQueryable<RegistroErrorDTO> ObtenerListadoErroresQuery();
        Task<bool> UpdateEstadoAsync(int errorId, int nuevoEstadoId);
    }
}
