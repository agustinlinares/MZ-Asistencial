using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class AcreditacionesIndividualesService : IAcreditacionesIndividualesService
    {
        private readonly MZAsistencialContext _context;
        private readonly IConfiguration _configuration;

        public AcreditacionesIndividualesService(MZAsistencialContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<IEnumerable<AcreditacionIndividualDTO>> GetAllAsync(int? mutuaId = null)
        {
            return await _context.FicherosAcreditacionesInformes
                .Where(f => (f.TipoAcreditacionId == null || f.TipoAcreditacionId == 2) && f.Visible == 1)
                .Where(f => mutuaId == null || f.MutuaId == mutuaId.Value)
                .GroupJoin(_context.Mutuas,
                    f => f.MutuaId,
                    m => m.MutuaId,
                    (f, mutuas) => new { f, mutuas })
                .SelectMany(
                    x => x.mutuas.DefaultIfEmpty(),
                    (x, m) => new AcreditacionIndividualDTO
                    {
                        FicheroId     = x.f.FicheroId,
                        NombreFichero = x.f.NombreFichero,
                        Servicio      = x.f.Servicio,
                        Especialidad  = x.f.Especialidad,
                        Poblacion     = x.f.Poblacion,
                        Provincia     = x.f.Provincia,
                        Mutua         = m != null ? m.Mutua1 : null,
                        DemandaId     = x.f.DemandaId,
                        FechaAlta     = x.f.FechaAlta,
                        Año           = x.f.FechaAlta != null ? x.f.FechaAlta.Value.Year : (int?)null,
                        Fichero       = x.f.Fichero
                    })
                .ToListAsync();
        }

        public async Task<int> GetMaxAñoAsync()
        {
            var maxFecha = await _context.FicherosAcreditacionesInformes
                .Where(f => (f.TipoAcreditacionId == null || f.TipoAcreditacionId == 2) && f.Visible == 1 && f.FechaAlta != null)
                .MaxAsync(f => (DateOnly?)f.FechaAlta);

            return maxFecha?.Year ?? DateTime.Today.Year;
        }

        public async Task<(string? filePath, string? nombreFichero)> GetFilePathAsync(int id)
        {
            var registro = await _context.FicherosAcreditacionesInformes
                .FirstOrDefaultAsync(f => f.FicheroId == id && (f.TipoAcreditacionId == null || f.TipoAcreditacionId == 2));

            if (registro == null || string.IsNullOrEmpty(registro.Fichero))
                return (null, null);

            var basePath = _configuration["AcreditacionesPaths:Base"]
                ?? throw new InvalidOperationException("AcreditacionesPaths:Base no está configurado en appsettings.");

            var filePath = Path.Combine(basePath, registro.Fichero);
            return (filePath, registro.NombreFichero ?? registro.Fichero);
        }

        public async Task LogAccesoAsync(int usuarioId)
        {
            _context.RegistroActividads.Add(new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha     = DateTime.Now,
                Accion    = "Acceso a menú Oferta / Demanda. Submenú Acreditaciones Individuales.",
            });
            await _context.SaveChangesAsync();
        }
    }
}
