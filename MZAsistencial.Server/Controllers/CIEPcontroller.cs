using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CIEPController : ControllerBase
{
    private readonly MZAsistencialContext _context;

    public CIEPController(MZAsistencialContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var lista = await _context.CodigosCieps
            .Join(_context.AuxEspecialidades,
                c => c.EspecialidadId,
                e => e.EspecialidadId,
                (c, e) => new
                {
                    ciepId = c.CiepId,
                    ciep = c.Ciep,
                    especialidadId = c.EspecialidadId,
                    especialidad = e.Especialidad
                })
            .OrderBy(x => x.ciepId)
            .ToListAsync();

        return Ok(lista);
    }

    [HttpGet("especialidades")]
    public async Task<IActionResult> GetEspecialidades()
    {
        var especialidades = await _context.AuxEspecialidades
            .Select(e => new { e.EspecialidadId, e.Especialidad })
            .OrderBy(e => e.Especialidad)
            .ToListAsync();

        return Ok(especialidades);
    }

    [HttpGet("por-especialidad/{especialidadId}")]
    public async Task<IActionResult> GetByEspecialidad(int especialidadId)
    {
        var lista = await _context.CodigosCieps
            .Where(c => c.EspecialidadId == especialidadId)
            .OrderBy(c => c.Ciep)
            .Select(c => new { c.CiepId, c.Ciep, c.EspecialidadId })
            .ToListAsync();

        return Ok(lista);
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> GetIdByCiep([FromQuery] string ciep, [FromQuery] int especialidadId)
    {
        var registro = await _context.CodigosCieps
            .FirstOrDefaultAsync(c => c.Ciep == ciep && c.EspecialidadId == especialidadId);

        if (registro == null) return NotFound();
        return Ok(new { registro.CiepId });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CodigosCiep dto)
    {
        _context.CodigosCieps.Add(dto);
        await _context.SaveChangesAsync();
        return Ok(dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CodigosCiep dto)
    {
        var ciep = await _context.CodigosCieps.FindAsync(id);
        if (ciep == null) return NotFound();

        ciep.Ciep = dto.Ciep;
        ciep.EspecialidadId = dto.EspecialidadId;
        await _context.SaveChangesAsync();
        return Ok(ciep);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ciep = await _context.CodigosCieps.FindAsync(id);
        if (ciep == null) return NotFound();

        _context.CodigosCieps.Remove(ciep);
        await _context.SaveChangesAsync();
        return Ok();
    }
}