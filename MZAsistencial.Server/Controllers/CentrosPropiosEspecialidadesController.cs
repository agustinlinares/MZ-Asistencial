using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CentrosPropiosEspecialidadesController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public CentrosPropiosEspecialidadesController(MZAsistencialContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetEspecialidades([FromQuery] int centroId, [FromQuery] int anio)
        {
            // 1. Obtener especialidades con ServicioId desde la tabla física
            var especialidades = await _context.CentrosPropiosEspecialidades
                .Where(x => x.CentroId == centroId && x.Año == anio)
                .ToListAsync();

            if (!especialidades.Any())
                return Ok(new List<object>());

            // 2. Obtener nombres de especialidad y servicio
            var espIds = especialidades.Select(e => e.EspecialidadId).Distinct().ToList();
            var svcIds = especialidades.Where(e => e.ServicioId.HasValue).Select(e => e.ServicioId!.Value).Distinct().ToList();

            var auxEsp = await _context.AuxEspecialidades
                .Where(e => espIds.Contains(e.EspecialidadId))
                .ToDictionaryAsync(e => e.EspecialidadId, e => e.Especialidad);

            var auxSvc = await _context.AuxServicios
                .Where(s => svcIds.Contains(s.ServicioId))
                .ToDictionaryAsync(s => s.ServicioId, s => s.Servicio);

            // 3. Obtener disponibilidad mensual
            var disponibilidad = await _context.DisponibilidadCentrosPropios
                .Where(x => x.CentroId == centroId && x.Año == anio)
                .ToListAsync();

            // 4. Cruzar y pivotar los meses
            var result = especialidades.Select(e =>
            {
                var meses = disponibilidad
                    .Where(d => d.EspecialidadId == e.EspecialidadId && d.ServicioId == (int?)e.ServicioId)
                    .ToList();

                int GetMes(int mes) => meses.FirstOrDefault(m => m.Mes == mes)?.Cantidad ?? 0;

                int ene = GetMes(1);
                int feb = GetMes(2);
                int mar = GetMes(3);
                int abr = GetMes(4);
                int may = GetMes(5);
                int jun = GetMes(6);
                int jul = GetMes(7);
                int ago = GetMes(8);
                int sep = GetMes(9);
                int oct = GetMes(10);
                int nov = GetMes(11);
                int dic = GetMes(12);
                int total = ene + feb + mar + abr + may + jun + jul + ago + sep + oct + nov + dic;

                string especialidadNombre = auxEsp.TryGetValue(e.EspecialidadId, out var en) ? en ?? "" : "";
                string servicioNombre     = e.ServicioId.HasValue && auxSvc.TryGetValue(e.ServicioId.Value, out var sn) ? sn ?? "" : e.Servicio;

                return new
                {
                    e.CentroPropioEspecialidadId,
                    e.EspecialidadId,
                    Especialidad   = especialidadNombre,
                    ServicioId     = e.ServicioId,
                    Servicio       = servicioNombre,
                    e.Cantidad,
                    Disponibilidad = e.Disponibilidad,
                    ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic,
                    total
                };
            }).ToList();

            return Ok(result);
        }

        [HttpGet("bloqueo")]
        public async Task<IActionResult> GetBloqueo()
        {
            var hoy = DateOnly.FromDateTime(DateTime.Today);
            var config = await _context.ConfiguracionAdministracions
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync();

            if (config == null)
                return Ok(new { bloqueado = false });

            var bloqueado = hoy >= config.FechaBloqueoDesde && hoy <= config.FechaBloqueoHasta;
            return Ok(new { bloqueado });
        }

        [HttpGet("catalogo")]
        public async Task<IActionResult> GetCatalogo([FromQuery] int centroId, [FromQuery] int anio)
        {
            var data = await (
                from c in _context.CentrosPropiosCatalogoServicios
                join e in _context.AuxEspecialidades on c.EspecialidadId equals e.EspecialidadId
                join s in _context.AuxServicios on (long)c.ServicioId equals s.ServicioId
                where c.CentroId == centroId && c.Año == anio
                select new
                {
                    c.CentroPropioCatalogoServiciosId,
                    c.EspecialidadId,
                    Especialidad = e.Especialidad,
                    c.ServicioId,
                    Servicio = s.Servicio,
                    c.Disponibilidad,
                    c.FechaAlta,
                    c.FechaBaja,
                }
            ).ToListAsync();

            return Ok(data);
        }
    }
}
