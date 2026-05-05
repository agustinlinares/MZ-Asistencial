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

        public async Task<List<RegistroICGDTO>> GetConcertadosByCentroIdAsync(int centroId)
        {
            return await _context.Icg06s
                .Where(x => x.CentroId == centroId)
                // Cruce con la tabla Concertados para sacar el nombre del centro
                .Join(_context.CentrosConcertados,
                    icg => icg.CentroId,
                    cc => cc.CentroId,
                    (icg, cc) => new { icg, cc })
                // Pasa por la tabla puente 'Conciertos' para buscar a qué mutuas está asociado
                .Join(_context.Conciertos,
                    temp1 => temp1.cc.CentroId,
                    c => c.CentroId,
                    (temp1, c) => new { temp1.icg, temp1.cc, c.MutuaId })
                // Cruza con 'Mutuas' para obtener el nombre real en texto
                .Join(_context.Mutuas, 
                    temp2 => temp2.MutuaId,
                    m => m.MutuaId,
                    (temp2, m) => new RegistroICGDTO
                    {
                        IdICG                 = temp2.icg.IdIcg,
                        Ano                   = temp2.icg.Año,
                        CentroId              = temp2.icg.CentroId,
                        Mutua                 = m.Mutua1, 
                        Centro                = temp2.cc.Centro,
                        FechaModificacion     = temp2.icg.FechaModificacion,
                        UsuarioModificacionId = temp2.icg.UsuarioModificacionId,
                    })
                .ToListAsync();
        }
    }
}

