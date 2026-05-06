using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class RegistroICGService
    {
        private readonly MZAsistencialContext _context;

        public RegistroICGService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<List<RegistroICGDTO>> GetByCentroIdAsync(int centroId)
        {
            var registros = await _context.Icg06s
                .Where(x => x.CentroId == centroId)
                .OrderByDescending(x => x.Año)
                .Select(x => new RegistroICGDTO
                {
                    IdICG                 = x.IdIcg,
                    Ano                   = x.Año,
                    CentroId              = x.CentroId,
                    FechaModificacion     = x.FechaModificacion,
                    UsuarioModificacionId = x.UsuarioModificacionId,
                })
                .ToListAsync();

            return registros;
        }
    }
}
