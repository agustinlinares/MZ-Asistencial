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
            return await _context.Icg07s
                // Unión de ICG07 con la tabla Conciertos usando el nuevo campo
                .Join(_context.Conciertos,
                    icg => icg.ConciertoId, // Mapeo de [Concierto_id]
                    c => c.ConciertoId,
                    (icg, c) => new { icg, c })
                    
                .Where(temp1 => temp1.c.CentroId == centroId)
                
                // Nombre del Centro Concertado
                .Join(_context.CentrosConcertados,
                    temp1 => temp1.c.CentroId,
                    cc => cc.CentroId,
                    (temp1, cc) => new { temp1.icg, temp1.c, cc })
                    
                // Nombre de la Mutua
                .Join(_context.Mutuas, 
                    temp2 => temp2.c.MutuaId,
                    m => m.MutuaId,
                    (temp2, m) => new RegistroICGDTO
                    {
                        IdICG                 = temp2.icg.IdIcg,  // Mapeo de [Id_ICG]
                        Ano                   = temp2.icg.Año,    // Mapeo de [Año]
                        CentroId              = temp2.c.CentroId, // Sacado de la relación
                        Mutua                 = m.Mutua1, 
                        Centro                = temp2.cc.Centro,
                        FechaModificacion     = temp2.icg.FechaModificacion, // Mapeo de [FechaModificacion]
                        UsuarioModificacionId = temp2.icg.UsuarioModificacionId // Mapeo de [UsuarioModificacion_id]
                    })
                .ToListAsync();
        }
    }
}

