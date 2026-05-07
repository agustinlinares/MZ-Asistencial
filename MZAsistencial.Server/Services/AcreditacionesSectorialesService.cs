using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public class AcreditacionesSectorialesService : IAcreditacionesSectorialesService
    {
        private readonly MZAsistencialContext _context;
        private readonly IConfiguration _configuration;

        public AcreditacionesSectorialesService(MZAsistencialContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<IEnumerable<AcreditacionSectorialDTO>> GetAllAsync()
        {
            return await _context.FicherosAcreditacionesInformes
                .GroupJoin(_context.Mutuas,
                    f => f.MutuaId,
                    m => m.MutuaId,
                    (f, mutuas) => new { f, mutuas })
                .SelectMany(
                    x => x.mutuas.DefaultIfEmpty(),
                    (x, m) => new AcreditacionSectorialDTO
                    {
                        FicheroId = x.f.FicheroId,
                        NombreFichero = x.f.NombreFichero,
                        TipoAcreditacion = _context.AuxTiposAcreditacions
                            .Where(t => t.TipoAcreditacionId == x.f.TipoAcreditacionId)
                            .Select(t => t.TipoAcreditacion)
                            .FirstOrDefault(),
                        Servicio = x.f.Servicio,
                        Especialidad = x.f.Especialidad,
                        Poblacion = x.f.Poblacion,
                        Provincia = x.f.Provincia,
                        Mutua = m != null ? m.Mutua1 : null,
                        FechaAlta = x.f.FechaAlta,
                        Visible = x.f.Visible == 1,
                        Fichero = x.f.Fichero
                    })
                .Where(x => x.Visible)
                .ToListAsync();
        }

        public async Task<(string? filePath, string? nombreFichero)> GetFilePathAsync(int id)
        {
            var registro = await _context.FicherosAcreditacionesInformes
                .FirstOrDefaultAsync(f => f.FicheroId == id);

            if (registro == null || string.IsNullOrEmpty(registro.Fichero))
                return (null, null);

            var basePath = _configuration["AcreditacionesPaths:Base"]
                ?? Path.Combine("C:\\MZFiles\\Acreditaciones");

            var filePath = Path.Combine(basePath, registro.Fichero);
            return (filePath, registro.NombreFichero ?? registro.Fichero);
        }
    }
}
