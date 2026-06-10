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

        public async Task<IEnumerable<InformeDisponibilidadDTO>> GetInformeDisponibilidadAsync(int año)
        {
            // Estados de oferta que consumen disponibilidad (confirmadas/aceptadas)
            var estadosConsumen = new[] { 2, 3, 4 };

            // 1. Disponibilidad declarada (vw_Disponibilidad ya agrega DisponibilidadCentrosPropios)
            var disponibilidad = await _context.VwDisponibilidads
                .Where(v => v.Año == año)
                .ToListAsync();

            // 2. Ofertas confirmadas que consumen disponibilidad
            var ofertasComprometidas = await _context.Ofertas
                .Where(o => o.Año == año && estadosConsumen.Contains(o.EstadoId ?? 0))
                .GroupBy(o => new { o.CentroId, o.EspecialidadId, o.ServicioId })
                .Select(g => new {
                    g.Key.CentroId,
                    g.Key.EspecialidadId,
                    g.Key.ServicioId,
                    Ene = g.Sum(x => x.Ene ?? 0),
                    Feb = g.Sum(x => x.Feb ?? 0),
                    Mar = g.Sum(x => x.Mar ?? 0),
                    Abr = g.Sum(x => x.Abr ?? 0),
                    May = g.Sum(x => x.May ?? 0),
                    Jun = g.Sum(x => x.Jun ?? 0),
                    Jul = g.Sum(x => x.Jul ?? 0),
                    Ago = g.Sum(x => x.Ago ?? 0),
                    Sep = g.Sum(x => x.Sep ?? 0),
                    Oct = g.Sum(x => x.Oct ?? 0),
                    Nov = g.Sum(x => x.Nov ?? 0),
                    Dic = g.Sum(x => x.Dic ?? 0),
                })
                .ToListAsync();

            // 3. Centros activos con su localización
            var centros = await _context.CentrosPropios
                .Where(c => c.FechaBaja == null)
                .ToListAsync();

            // 4. Tablas auxiliares
            var poblaciones  = await _context.AuxPoblaciones.ToListAsync();
            var provincias   = await _context.AuxProvincias.ToListAsync();
            var especialidades = await _context.AuxEspecialidades.ToListAsync();
            var servicios    = await _context.AuxServicios.ToListAsync();

            // 5. Servicios en tarifa activa para el año
            var añoStr = año.ToString();
            var tarifasActivas = await _context.Tarifas
                .Where(t => t.Año == añoStr && t.Activo == 1)
                .Select(t => t.TarifaId)
                .ToListAsync();

            var serviciosEnTarifa = await _context.TarifasDetalles
                .Where(td => tarifasActivas.Contains(td.TarifaId))
                .Select(td => new { td.EspecialidadId, td.ServicioId })
                .Distinct()
                .ToListAsync();

            // 6. Calcular disponibilidad pendiente por combinación centro+especialidad+servicio
            var resultado = new List<InformeDisponibilidadDTO>();

            var grupos = disponibilidad
                .GroupBy(v => new { v.CentroId, v.EspecialidadId, v.ServicioId });

            foreach (var grupo in grupos)
            {
                var centroId      = grupo.Key.CentroId;
                var especialidadId = grupo.Key.EspecialidadId;
                var servicioId    = grupo.Key.ServicioId;

                // Filtrar por tarifa activa (ServicioId es long en TarifasDetalle)
                var servicioIdLong = (long?)servicioId;
                if (!serviciosEnTarifa.Any(s => s.EspecialidadId == especialidadId && s.ServicioId == servicioIdLong))
                    continue;

                var centro = centros.FirstOrDefault(c => c.CentroId == centroId);
                if (centro == null) continue;

                var poblacion    = poblaciones.FirstOrDefault(p => p.PoblacionId == centro.PoblacionId);
                var provincia    = provincias.FirstOrDefault(p => p.ProvinciaId == poblacion?.ProvinciaId);
                var especialidad = especialidades.FirstOrDefault(e => e.EspecialidadId == especialidadId);
                var servicio     = servicios.FirstOrDefault(s => s.ServicioId == servicioIdLong);

                var comprometido = ofertasComprometidas
                    .FirstOrDefault(o => o.CentroId == centroId && o.EspecialidadId == especialidadId && o.ServicioId == servicioId);

                var ene = grupo.Sum(v => v.Enero)      - (comprometido?.Ene ?? 0);
                var feb = grupo.Sum(v => v.Febrero)    - (comprometido?.Feb ?? 0);
                var mar = grupo.Sum(v => v.Marzo)      - (comprometido?.Mar ?? 0);
                var abr = grupo.Sum(v => v.Abril)      - (comprometido?.Abr ?? 0);
                var may = grupo.Sum(v => v.Mayo)       - (comprometido?.May ?? 0);
                var jun = grupo.Sum(v => v.Junio)      - (comprometido?.Jun ?? 0);
                var jul = grupo.Sum(v => v.Julio)      - (comprometido?.Jul ?? 0);
                var ago = grupo.Sum(v => v.Agosto)     - (comprometido?.Ago ?? 0);
                var sep = grupo.Sum(v => v.Septiembre) - (comprometido?.Sep ?? 0);
                var oct = grupo.Sum(v => v.Octubre)    - (comprometido?.Oct ?? 0);
                var nov = grupo.Sum(v => v.Noviembre)  - (comprometido?.Nov ?? 0);
                var dic = grupo.Sum(v => v.Diciembre)  - (comprometido?.Dic ?? 0);
                var total = ene + feb + mar + abr + may + jun + jul + ago + sep + oct + nov + dic;

                if (total <= 0) continue;

                resultado.Add(new InformeDisponibilidadDTO
                {
                    Provincia    = provincia?.Provincia,
                    Localidad    = poblacion?.Poblacion,
                    Especialidad = especialidad?.Especialidad,
                    Servicio     = servicio?.Servicio,
                    PendienteEnero      = Math.Max(0, ene),
                    PendienteFebrero    = Math.Max(0, feb),
                    PendienteMarzo      = Math.Max(0, mar),
                    PendienteAbril      = Math.Max(0, abr),
                    PendienteMayo       = Math.Max(0, may),
                    PendienteJunio      = Math.Max(0, jun),
                    PendienteJulio      = Math.Max(0, jul),
                    PendienteAgosto     = Math.Max(0, ago),
                    PendienteSeptiembre = Math.Max(0, sep),
                    PendienteOctubre    = Math.Max(0, oct),
                    PendienteNoviembre  = Math.Max(0, nov),
                    PendienteDiciembre  = Math.Max(0, dic),
                    PendienteTotal      = Math.Max(0, total),
                });
            }

            // Agrupar por Provincia+Localidad+Especialidad+Servicio sumando
            return resultado
                .GroupBy(r => new { r.Provincia, r.Localidad, r.Especialidad, r.Servicio })
                .Select(g => new InformeDisponibilidadDTO
                {
                    Provincia    = g.Key.Provincia,
                    Localidad    = g.Key.Localidad,
                    Especialidad = g.Key.Especialidad,
                    Servicio     = g.Key.Servicio,
                    PendienteEnero      = g.Sum(x => x.PendienteEnero),
                    PendienteFebrero    = g.Sum(x => x.PendienteFebrero),
                    PendienteMarzo      = g.Sum(x => x.PendienteMarzo),
                    PendienteAbril      = g.Sum(x => x.PendienteAbril),
                    PendienteMayo       = g.Sum(x => x.PendienteMayo),
                    PendienteJunio      = g.Sum(x => x.PendienteJunio),
                    PendienteJulio      = g.Sum(x => x.PendienteJulio),
                    PendienteAgosto     = g.Sum(x => x.PendienteAgosto),
                    PendienteSeptiembre = g.Sum(x => x.PendienteSeptiembre),
                    PendienteOctubre    = g.Sum(x => x.PendienteOctubre),
                    PendienteNoviembre  = g.Sum(x => x.PendienteNoviembre),
                    PendienteDiciembre  = g.Sum(x => x.PendienteDiciembre),
                    PendienteTotal      = g.Sum(x => x.PendienteTotal),
                })
                .Where(r => r.PendienteTotal > 0)
                .OrderBy(r => r.Provincia)
                .ThenBy(r => r.Localidad)
                .ThenBy(r => r.Especialidad)
                .ThenBy(r => r.Servicio)
                .ToList();
        }
    }
}
