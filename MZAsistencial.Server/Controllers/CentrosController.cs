using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/centros")]
public class CentrosController : ControllerBase
{
    private readonly MZAsistencialContext _context;

    public CentrosController(MZAsistencialContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.CentrosPropios
            .Where(c => !c.Desactivado)
            .OrderBy(c => c.Centro)
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("lookup")]
    public async Task<IActionResult> Lookup()
    {
        var items = await _context.CentrosPropios
            .Where(c => !c.Desactivado)
            .OrderBy(c => c.Centro)
            .Select(c => new { id = c.CentroId, nombre = c.Centro })
            .ToListAsync();

        return Ok(items);
    }
}
