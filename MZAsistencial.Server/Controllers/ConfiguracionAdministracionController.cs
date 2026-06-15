using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfiguracionAdministracionController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public ConfiguracionAdministracionController(MZAsistencialContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var config = await _context.ConfiguracionAdministracions
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync();
            if (config == null) return NotFound();
            return Ok(ToDTO(config));
        }

        [HttpGet("años")]
        public async Task<IActionResult> GetAños()
        {
            var todosAños = await _context.Tarifas
                .Select(t => t.Año)
                .Distinct()
                .OrderByDescending(a => a)
                .ToListAsync();

            var aniosOrigen  = todosAños.Skip(1).ToList();
            var aniosDestino = todosAños.Take(1).ToList();

            return Ok(new { aniosOrigen, aniosDestino });
        }

        [HttpGet("mutuas")]
        public async Task<IActionResult> GetMutuas()
        {
            var mutuas = await _context.Mutuas
                .Select(m => new { mutuaId = m.MutuaId, mutua = m.Mutua1 })
                .OrderBy(m => m.mutua)
                .ToListAsync();
            return Ok(mutuas);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ConfiguracionAdministracionDTO dto)
        {
            var config = await _context.ConfiguracionAdministracions
                .FirstOrDefaultAsync(x => x.Id == id);
            if (config == null) return NotFound();

            if (!DateOnly.TryParse(dto.FechaBloqueoDesde, out var desde))
                return BadRequest(new { error = "FechaBloqueoDesde inválida" });
            if (!DateOnly.TryParse(dto.FechaBloqueoHasta, out var hasta))
                return BadRequest(new { error = "FechaBloqueoHasta inválida" });
            if (desde > hasta)
                return BadRequest(new { error = "FechaBloqueoDesde debe ser anterior a FechaBloqueoHasta" });

            config.FechaBloqueoDesde                   = desde;
            config.FechaBloqueoHasta                   = hasta;
            config.MinimoServicios                     = dto.MinimoServicios;
            config.RatioServicios                      = dto.RatioServicios;
            config.PlazoRespuestaDemandasAnuales       = dto.PlazoRespuestaDemandasAnuales;
            config.PlazoRespuestaDemandaAnualTrasAviso = dto.PlazoRespuestaDemandaAnualTrasAviso;
            config.PlazoContestacionRespuestaRecibida  = dto.PlazoContestacionRespuestaRecibida;
            config.PlazoEjecucionProcesosAutomaticos   = dto.PlazoEjecucionProcesosAutomaticos;
            config.UsuarioModificacionId               = dto.UsuarioModificacionId;
            config.FechaModificacion                   = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(ToDTO(config));
        }

        [HttpPost("replicar-disponibilidad")]
        public async Task<IActionResult> ReplicarDisponibilidad([FromBody] ReplicarDTO dto)
        {
            var centrosMutua = await _context.CentrosPropios
                .Where(cp => cp.MutuaId == dto.MutuaId)
                .Select(cp => cp.CentroId)
                .ToListAsync();

            var hayDatosOrigen = await _context.DisponibilidadCentrosPropios
                .AnyAsync(d => d.Año == dto.AnioOrigen && centrosMutua.Contains(d.CentroId ?? 0));
            if (!hayDatosOrigen)
                return BadRequest(new { message = "No existen datos de disponibilidad para la mutua y año de origen seleccionados." });

            var hayDatosOrigenEsp = await _context.CentrosPropiosEspecialidades
                .AnyAsync(e => e.Año == dto.AnioOrigen && centrosMutua.Contains(e.CentroId));
            if (!hayDatosOrigenEsp)
                return BadRequest(new { message = "No existen datos de especialidades para la mutua y año de origen seleccionados." });

            var hayDatosDestino = await _context.DisponibilidadCentrosPropios
                .AnyAsync(d => d.Año == dto.AnioDestino && centrosMutua.Contains(d.CentroId ?? 0));
            if (hayDatosDestino && !dto.Forzar)
                return Conflict(new { message = "Ya existen datos para el año destino. ¿Desea sustituirlos?" });

            var centrosAbiertosConDisp = await _context.DisponibilidadCentrosPropios
                .Where(d => d.Año == dto.AnioOrigen && centrosMutua.Contains(d.CentroId ?? 0))
                .Select(d => d.CentroId ?? 0)
                .Distinct()
                .ToListAsync();

            var centrosAbiertos = await _context.CentrosPropios
                .Where(cp => cp.MutuaId == dto.MutuaId && cp.FechaBaja == null && centrosAbiertosConDisp.Contains(cp.CentroId))
                .Select(cp => cp.CentroId)
                .ToListAsync();

            if (!centrosAbiertos.Any())
                return BadRequest(new { message = "No hay centros abiertos con disponibilidad para esta mutua." });

            var anioDestinoStr = dto.AnioDestino.ToString();
            var serviciosEnTarifa = await _context.TarifasDetalles
                .Where(td => _context.Tarifas.Any(t => t.TarifaId == td.TarifaId && t.Año == anioDestinoStr))
                .Select(td => td.ServicioId)
                .Distinct()
                .ToListAsync();

            if (dto.Forzar)
            {
                var aEliminarDisp = _context.DisponibilidadCentrosPropios
                    .Where(d => d.Año == dto.AnioDestino && centrosAbiertos.Contains(d.CentroId ?? 0));
                _context.DisponibilidadCentrosPropios.RemoveRange(aEliminarDisp);

                var aEliminarEsp = _context.CentrosPropiosEspecialidades
                    .Where(e => e.Año == dto.AnioDestino && centrosAbiertos.Contains(e.CentroId));
                _context.CentrosPropiosEspecialidades.RemoveRange(aEliminarEsp);

                await _context.SaveChangesAsync();
            }

            var registrosDisp = await _context.DisponibilidadCentrosPropios
                .Where(d => d.Año == dto.AnioOrigen &&
                    centrosAbiertos.Contains(d.CentroId ?? 0) &&
                    serviciosEnTarifa.Contains(d.ServicioId ?? 0))
                .ToListAsync();

            foreach (var r in registrosDisp)
            {
                _context.DisponibilidadCentrosPropios.Add(new DisponibilidadCentrosPropio
                {
                    CentroId       = r.CentroId,
                    ServicioId     = r.ServicioId,
                    EspecialidadId = r.EspecialidadId,
                    Mes            = r.Mes,
                    Año            = dto.AnioDestino,
                    Cantidad       = r.Cantidad,
                });
            }

            var registrosEsp = await _context.CentrosPropiosEspecialidades
                .Where(e => e.Año == dto.AnioOrigen &&
                    centrosAbiertos.Contains(e.CentroId) &&
                    serviciosEnTarifa.Contains((int)(e.ServicioId ?? 0)) &&
                    e.FechaBaja == null)
                .ToListAsync();

            foreach (var e in registrosEsp)
            {
                _context.CentrosPropiosEspecialidades.Add(new CentrosPropiosEspecialidade
                {
                    CentroId          = e.CentroId,
                    ServicioId        = e.ServicioId,
                    EspecialidadId    = e.EspecialidadId,
                    Servicio          = e.Servicio,
                    Año               = dto.AnioDestino,
                    Cantidad          = e.Cantidad,
                    ImporteConIva     = e.ImporteConIva,
                    Disponibilidad    = e.Disponibilidad,
                    FechaAlta         = DateTime.Now,
                    FechaModificacion = DateTime.Now,
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Disponibilidad replicada correctamente. {registrosDisp.Count} registros copiados." });
        }

        [HttpPost("replicar-catalogo")]
        public async Task<IActionResult> ReplicarCatalogo([FromBody] ReplicarDTO dto)
        {
            var centrosMutua = await _context.CentrosPropios
                .Where(cp => cp.MutuaId == dto.MutuaId)
                .Select(cp => cp.CentroId)
                .ToListAsync();

            var hayOrigen = await _context.CentrosPropiosCatalogoServicios
                .AnyAsync(c => c.Año == dto.AnioOrigen && centrosMutua.Contains(c.CentroId));
            if (!hayOrigen)
                return BadRequest(new { message = "No existen datos de catálogo para la mutua y año de origen seleccionados." });

            var hayDestino = await _context.CentrosPropiosCatalogoServicios
                .AnyAsync(c => c.Año == dto.AnioDestino && centrosMutua.Contains(c.CentroId));
            if (hayDestino && !dto.Forzar)
                return Conflict(new { message = "Ya existen datos de catálogo para el año destino. ¿Desea sustituirlos?" });

            var centrosConCatalogo = await _context.CentrosPropiosCatalogoServicios
                .Where(c => c.Año == dto.AnioOrigen && centrosMutua.Contains(c.CentroId))
                .Select(c => c.CentroId)
                .Distinct()
                .ToListAsync();

            var centrosAbiertos = await _context.CentrosPropios
                .Where(cp => cp.MutuaId == dto.MutuaId && cp.FechaBaja == null && centrosConCatalogo.Contains(cp.CentroId))
                .Select(cp => cp.CentroId)
                .ToListAsync();

            if (!centrosAbiertos.Any())
                return BadRequest(new { message = "No hay centros abiertos con catálogo para esta mutua." });

            var anioDestinoStr = dto.AnioDestino.ToString();
            var serviciosEnTarifa = await _context.TarifasDetalles
                .Where(td => _context.Tarifas.Any(t => t.TarifaId == td.TarifaId && t.Año == anioDestinoStr))
                .Select(td => new { td.ServicioId, td.EspecialidadId })
                .Distinct()
                .ToListAsync();

            var serviciosIds = serviciosEnTarifa.Select(s => s.ServicioId).Distinct().ToList();

            if (dto.Forzar)
            {
                var aEliminar = _context.CentrosPropiosCatalogoServicios
                    .Where(c => c.Año == dto.AnioDestino && centrosAbiertos.Contains(c.CentroId));
                _context.CentrosPropiosCatalogoServicios.RemoveRange(aEliminar);
                await _context.SaveChangesAsync();
            }

            var registros = await _context.CentrosPropiosCatalogoServicios
                .Where(c => c.Año == dto.AnioOrigen &&
                    centrosAbiertos.Contains(c.CentroId) &&
                    serviciosIds.Contains(c.ServicioId) &&
                    c.FechaBaja == null)
                .ToListAsync();

            int insertados = 0;
            foreach (var r in registros)
            {
                var enTarifa = serviciosEnTarifa.Any(s => s.ServicioId == r.ServicioId && s.EspecialidadId == r.EspecialidadId);
                if (!enTarifa) continue;

                _context.CentrosPropiosCatalogoServicios.Add(new CentrosPropiosCatalogoServicio
                {
                    CentroId       = r.CentroId,
                    ServicioId     = r.ServicioId,
                    EspecialidadId = r.EspecialidadId,
                    Año            = dto.AnioDestino,
                    Disponibilidad = r.Disponibilidad,
                    UsuarioAltaId  = 1,
                    FechaAlta      = DateTime.Now,
                });
                insertados++;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Catálogo replicado correctamente. {insertados} registros copiados." });
        }

        private static ConfiguracionAdministracionDTO ToDTO(ConfiguracionAdministracion c) => new()
        {
            Id                                    = c.Id,
            FechaBloqueoDesde                     = c.FechaBloqueoDesde.ToString("yyyy-MM-dd"),
            FechaBloqueoHasta                     = c.FechaBloqueoHasta.ToString("yyyy-MM-dd"),
            MinimoServicios                       = c.MinimoServicios,
            RatioServicios                        = c.RatioServicios,
            PlazoRespuestaDemandasAnuales         = c.PlazoRespuestaDemandasAnuales,
            PlazoRespuestaDemandaAnualTrasAviso   = c.PlazoRespuestaDemandaAnualTrasAviso,
            PlazoContestacionRespuestaRecibida    = c.PlazoContestacionRespuestaRecibida,
            PlazoEjecucionProcesosAutomaticos     = c.PlazoEjecucionProcesosAutomaticos,
            UsuarioModificacionId                 = c.UsuarioModificacionId,
            FechaModificacion                     = c.FechaModificacion,
        };
    }

    public class ReplicarDTO
    {
        public int  AnioOrigen  { get; set; }
        public int  AnioDestino { get; set; }
        public int  MutuaId     { get; set; }
        public bool Forzar      { get; set; } = false;
    }
}