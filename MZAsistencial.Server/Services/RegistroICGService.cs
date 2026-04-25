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
            return await _context.Icg06s
                .Where(x => x.CentroId == centroId)
                .Join(_context.CentrosPropios,
                    icg => icg.CentroId,
                    cp => cp.CentroId,
                    (icg, cp) => new RegistroICGDTO
                    {
                        IdICG                = icg.IdIcg,
                        Ano                  = icg.Año,
                        CentroId             = icg.CentroId,
                        Mutua                = cp.MutuaId.ToString(),
                        Centro               = cp.Centro,
                        FechaModificacion    = icg.FechaModificacion,
                        UsuarioModificacionId = icg.UsuarioModificacionId,
                    })
                .ToListAsync();
        }
    }
}

