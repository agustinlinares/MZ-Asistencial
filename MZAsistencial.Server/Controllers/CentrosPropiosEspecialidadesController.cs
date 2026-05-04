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
            var data = await _context.VwEspecialidadesPropios
                .Where(x => x.CentroId == centroId && x.Año == anio)
                .Select(x => new {
                    x.CentroPropioEspecialidadId,
                    x.EspecialidadId,
                    x.Especialidad,
                    x.Servicio,
                    x.Cantidad,
                })
                .ToListAsync();
            return Ok(data);
        }

        [HttpGet("catalogo")]
        public async Task<IActionResult> GetCatalogo([FromQuery] int centroId, [FromQuery] int anio)
        {
            var data = await (
                from c in _context.CentrosPropiosCatalogoServicios
                join e in _context.AuxEspecialidades on c.EspecialidadId equals e.EspecialidadId
                join s in _context.AuxServicios on (long)c.ServicioId equals s.ServicioId
                where c.CentroId == centroId && c.Año == anio
                select new {
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
