using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuxPoblacionesController : ControllerBase
{
    private readonly MZAsistencialContext _context;

    public AuxPoblacionesController(MZAsistencialContext context)
    {
        _context = context;
    }

    // GET: api/auxpoblaciones/{provinciaId}
    // Devuelve las poblaciones de una provincia concreta
    [HttpGet("{provinciaId}")]
    public async Task<ActionResult> GetPoblaciones(int provinciaId)
    {
        var poblaciones = await _context.AuxPoblaciones
            .Where(p => p.ProvinciaId == provinciaId)
            .OrderBy(p => p.Poblacion)
            .Select(p => new {
                poblacionId = p.PoblacionId,
                poblacion = p.Poblacion
            })
            .ToListAsync();

        return Ok(poblaciones);
    }
}