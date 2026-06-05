using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

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

        public async Task<IEnumerable<AcreditacionSectorialDTO>> GetAllAsync(int? mutuaId = null)
        {
            var query = _context.FicherosAcreditacionesInformes.AsQueryable();

            if (mutuaId.HasValue)
                query = query.Where(f => f.MutuaId == mutuaId.Value);

            return await query
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

        public async Task<(int? ficheroId, string message)> CreateTestRecordAsync()
        {
            var basePath = _configuration["AcreditacionesPaths:Base"]
                ?? Path.Combine("C:\\MZFiles\\Acreditaciones");

            Directory.CreateDirectory(basePath);

            const string testFileName = "test_acreditacion_descarga.pdf";
            var testFilePath = Path.Combine(basePath, testFileName);

            await File.WriteAllTextAsync(testFilePath,
                "Fichero de prueba para verificar la descarga de acreditaciones sectoriales.");

            var existing = await _context.FicherosAcreditacionesInformes
                .FirstOrDefaultAsync(f => f.Fichero == testFileName);

            if (existing != null)
                return (existing.FicheroId, "Registro de prueba ya existente.");

            var mutua = await _context.Mutuas.FirstOrDefaultAsync();
            if (mutua == null)
                return (null, "No hay mutuas disponibles en la base de datos.");

            var registro = new FicherosAcreditacionesInforme
            {
                Fichero       = testFileName,
                NombreFichero = "Acreditación de Prueba.pdf",
                Servicio      = "Servicio Test",
                Especialidad  = "Especialidad Test",
                Poblacion     = "Madrid",
                Provincia     = "Madrid",
                MutuaId       = mutua.MutuaId,
                FechaAlta     = DateOnly.FromDateTime(DateTime.Today),
                Visible       = 1,
                ActivoId      = 0,
            };

            _context.FicherosAcreditacionesInformes.Add(registro);
            await _context.SaveChangesAsync();

            return (registro.FicheroId, "Registro de prueba creado correctamente.");
        }
    }
}
