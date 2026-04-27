using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IcgConciertosController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public IcgConciertosController(MZAsistencialContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IcgConciertoDto>>> Get()
        {
            var data = await _context.IcgConciertos
                .AsNoTracking()
                .OrderByDescending(x => x.Id_Icg)
                .Select(x => new IcgConciertoDto
                {
                    Id_Icg = x.Id_Icg,
                    Localizador = x.Localizador,
                    Concierto_id = x.Concierto_id,
                    CodCASA = x.CodCASA,
                    Mutua = x.Mutua,
                    Centro_id = x.Centro_id,
                    Centro = x.Centro,
                    Poblacion = x.Poblacion,
                    Provincia = x.Provincia,
                    AsistenciaSanitaria = x.AsistenciaSanitaria,
                    IncapacidadTemp = x.IncapacidadTemp,
                    Gastos = x.Gastos,
                    Articulo25 = x.Articulo25,
                    Total = x.Total,
                    Confirmar = x.Confirmar
                })
                .ToListAsync();

            return Ok(data);
        }
    }
}