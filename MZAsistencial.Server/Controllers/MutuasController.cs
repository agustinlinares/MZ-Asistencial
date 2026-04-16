
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MutuasController : ControllerBase
{
    private readonly AppDbContext _context;

    public MutuasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/mutuas
    // Devuelve la lista con solo los 6 campos del DTO
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MutuaDTO>>> GetMutuas()
    {
        var mutuas = await _context.Mutuas
            .Include(m => m.PoblacionNavigation)
                .ThenInclude(p => p.Provincia)
            .Select(m => new MutuaDTO
            {
                Nº    = m.MutuaId,
                //Numero    = m.NumeroMutua ?? "",
                Mutua     = m.Mutua1 ?? "",
                Direccion = m.Direccion ?? "",
                CP        = m.Cp ?? "",
                Poblacion = m.PoblacionNavigation != null
                            ? m.PoblacionNavigation.Poblacion ?? ""
                            : "",
                Provincia = m.PoblacionNavigation != null && m.PoblacionNavigation.Provincia != null
                            //? m.PoblacionNavigation.Provincia.Provincia1 ?? ""
                            ? m.PoblacionNavigation.Provincia.Provincia ?? ""
                            : ""
            })
            .ToListAsync();

        return Ok(mutuas);
    }

    // GET: api/mutuas/5
    // Devuelve una sola mutua también con el DTO
    [HttpGet("{id}")]
    public async Task<ActionResult<MutuaDTO>> GetMutua(int id)
    {
        var mutua = await _context.Mutuas
            .Include(m => m.PoblacionNavigation)
                .ThenInclude(p => p.Provincia)
            .Where(m => m.MutuaId == id)
            .Select(m => new MutuaDTO
            {
                Nº    = m.MutuaId,
                //Numero    = m.NumeroMutua ?? "",
                Mutua     = m.Mutua1 ?? "",
                Direccion = m.Direccion ?? "",
                CP        = m.Cp ?? "",
                Poblacion = m.PoblacionNavigation != null
                            ? m.PoblacionNavigation.Poblacion ?? ""
                            : "",
                Provincia = m.PoblacionNavigation != null && m.PoblacionNavigation.Provincia != null
                            //? m.PoblacionNavigation.Provincia.Provincia1 ?? ""
                            ? m.PoblacionNavigation.Provincia.Provincia ?? ""
                            : ""
            })
            .FirstOrDefaultAsync();

        if (mutua == null)
            return NotFound();

        return Ok(mutua);
    }

    // POST: api/mutuas
    // Aquí recibe el modelo completo porque necesita todos los datos para guardar
    [HttpPost]
    public async Task<ActionResult<MutuaDTO>> CreateMutua(Mutua mutua)
    {
        _context.Mutuas.Add(mutua);
        await _context.SaveChangesAsync();

        // Devuelve el DTO del registro recién creado
        return CreatedAtAction(nameof(GetMutua), new { id = mutua.MutuaId }, mutua);
    }

    // PUT: api/mutuas/5
    // Recibe el modelo completo para actualizar
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMutua(int id, Mutua mutua)
    {
        if (id != mutua.MutuaId)
            return BadRequest();

        _context.Entry(mutua).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/mutuas/5
    // Solo necesita el id, sin DTO
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMutua(int id)
    {
        var mutua = await _context.Mutuas.FindAsync(id);

        if (mutua == null)
            return NotFound();

        _context.Mutuas.Remove(mutua);
        await _context.SaveChangesAsync();

        return NoContent();

    }
}