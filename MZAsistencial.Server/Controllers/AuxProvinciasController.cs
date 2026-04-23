using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuxProvinciasController : ControllerBase
{
    private readonly MZAsistencialContext _context;

    public AuxProvinciasController(MZAsistencialContext context)
    {
        _context = context;
    }

    // GET: api/auxprovincias
    // Devuelve todas las provincias para el combo
    [HttpGet]
    public async Task<ActionResult> GetProvincias()
    {
        var provincias = await _context.AuxProvincias
            .OrderBy(p => p.Provincia)
            .Select(p => new {
                provinciaId = p.ProvinciaId,
                provincia = p.Provincia.Trim()
            })
            .ToListAsync();

        return Ok(provincias);
    }
}