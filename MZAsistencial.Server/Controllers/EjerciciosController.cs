using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EjerciciosController : ControllerBase
{
    private readonly MZAsistencialContext _context;

    public EjerciciosController(MZAsistencialContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetEjercicios()
    {
        var ejercicios = await _context.Ejercicios
            .OrderByDescending(e => e.Año)
            .Select(e => new
            {
                año = e.Año,
                fechaApertura = e.FechaApertura,
                fechaCierre = e.FechaCierre
            })
            .ToListAsync();

        return Ok(ejercicios);
    }
}