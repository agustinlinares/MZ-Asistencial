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

        // GET: api/ConfiguracionAdministracion
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var config = await _context.ConfiguracionAdministracions
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync();

            if (config == null) return NotFound();

            return Ok(ToDTO(config));
        }

        // PUT: api/ConfiguracionAdministracion/{id}
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
}
