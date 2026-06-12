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
            var especialidades = await _context.CentrosPropiosEspecialidades
                .Where(x => x.CentroId == centroId && x.Año == anio)
                .ToListAsync();

            if (!especialidades.Any())
                return Ok(new List<object>());

            var espIds = especialidades.Select(e => e.EspecialidadId).Distinct().ToList();
            var svcIds = especialidades.Where(e => e.ServicioId.HasValue).Select(e => e.ServicioId!.Value).Distinct().ToList();

            var auxEsp = await _context.AuxEspecialidades
                .Where(e => espIds.Contains(e.EspecialidadId))
                .ToDictionaryAsync(e => e.EspecialidadId, e => e.Especialidad);

            var auxSvc = await _context.AuxServicios
                .Where(s => svcIds.Contains(s.ServicioId))
                .ToDictionaryAsync(s => s.ServicioId, s => s.Servicio);

            var disponibilidad = await _context.DisponibilidadCentrosPropios
                .Where(x => x.CentroId == centroId && x.Año == anio)
                .ToListAsync();

            var result = especialidades.Select(e =>
            {
                var meses = disponibilidad
                    .Where(d => d.EspecialidadId == e.EspecialidadId && d.ServicioId == (int?)e.ServicioId)
                    .ToList();

                int GetMes(int mes) => meses.FirstOrDefault(m => m.Mes == mes)?.Cantidad ?? 0;

                int ene = GetMes(1);  int feb = GetMes(2);  int mar = GetMes(3);
                int abr = GetMes(4);  int may = GetMes(5);  int jun = GetMes(6);
                int jul = GetMes(7);  int ago = GetMes(8);  int sep = GetMes(9);
                int oct = GetMes(10); int nov = GetMes(11); int dic = GetMes(12);
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
                    Servicio     = s.Servicio,
                    c.Disponibilidad,
                    c.FechaAlta,
                    c.FechaBaja,
                }
            ).ToListAsync();

            return Ok(data);
        }

        // PUT /api/CentrosPropiosEspecialidades/{id}/disponibilidad
        [HttpPut("{id}/disponibilidad")]
        public async Task<IActionResult> PutDisponibilidad(int id, [FromBody] DisponibilidadRequest req)
        {
            var esp = await _context.CentrosPropiosEspecialidades
                .FirstOrDefaultAsync(x => x.CentroPropioEspecialidadId == id);

            if (esp == null) return NotFound();

            var cantidades = new[] { req.Ene, req.Feb, req.Mar, req.Abr, req.May, req.Jun,
                                     req.Jul, req.Ago, req.Sep, req.Oct, req.Nov, req.Dic };

            // Upsert en DisponibilidadCentrosPropios (uno por mes)
            for (int mes = 1; mes <= 12; mes++)
            {
                int cantidad = cantidades[mes - 1];

                var disp = await _context.DisponibilidadCentrosPropios
                    .FirstOrDefaultAsync(d =>
                        d.CentroId      == esp.CentroId &&
                        d.EspecialidadId == esp.EspecialidadId &&
                        d.ServicioId    == (int?)esp.ServicioId &&
                        d.Año           == esp.Año &&
                        d.Mes           == mes);

                if (disp == null)
                {
                    _context.DisponibilidadCentrosPropios.Add(new MZAsistencial.Server.Models.DisponibilidadCentrosPropio
                    {
                        CentroId       = esp.CentroId,
                        EspecialidadId = esp.EspecialidadId,
                        ServicioId     = (int?)esp.ServicioId,
                        Año            = esp.Año,
                        Mes            = mes,
                        Cantidad       = cantidad,
                    });
                }
                else
                {
                    disp.Cantidad = cantidad;
                }
            }

            // Insertar en histórico
            _context.HistoricoCentrosPropiosEspecialidades.Add(new MZAsistencial.Server.Models.HistoricoCentrosPropiosEspecialidade
            {
                CentroId              = esp.CentroId,
                Año                   = esp.Año,
                EspecialidadId        = esp.EspecialidadId,
                ServicioId            = esp.ServicioId,
                FechaAlta             = DateTime.Now,
                Disponibilidad        = esp.Disponibilidad,
                Ene = req.Ene, Feb = req.Feb, Mar = req.Mar, Abr = req.Abr,
                May = req.May, Jun = req.Jun, Jul = req.Jul, Ago = req.Ago,
                Sep = req.Sep, Oct = req.Oct, Nov = req.Nov, Dic = req.Dic,
                UsuarioModificacionId = req.UsuarioId,
            });

            // Actualizar fecha en la especialidad
            esp.FechaActualizarDisponibilidad = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { ok = true });
        }
    }

    public class DisponibilidadRequest
    {
        public int  Ene { get; set; }
        public int  Feb { get; set; }
        public int  Mar { get; set; }
        public int  Abr { get; set; }
        public int  May { get; set; }
        public int  Jun { get; set; }
        public int  Jul { get; set; }
        public int  Ago { get; set; }
        public int  Sep { get; set; }
        public int  Oct { get; set; }
        public int  Nov { get; set; }
        public int  Dic { get; set; }
        public int? UsuarioId { get; set; }
    }
}
