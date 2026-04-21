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
    private readonly MZAsistencialContext _context;

    public MutuasController(MZAsistencialContext context)
    {
        _context = context;
    }

    // GET: api/mutuas
    // Devuelve la lista de mutuas con los campos del DTO
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MutuaDTO>>> GetMutuas()
    {
        var mutuas = await _context.Mutuas
            .Select(m => new MutuaDTO
            {
<<<<<<< HEAD
                Nº    = m.MutuaId,
                //Numero    = m.NumeroMutua ?? "",
                Mutua     = m.Mutua1 ?? "", //Nombre
=======
                Nº = m.MutuaId,
                Mutua = m.Mutua1 ?? "",
>>>>>>> 0050b40e386026e1ebe9aa21b097c37241f1b699
                Direccion = m.Direccion ?? "",
                CP = m.Cp ?? "",
                Poblacion = "",
                Provincia = ""
            })
            .ToListAsync();

        return Ok(mutuas);
    }

    // GET: api/mutuas/5
    // Devuelve una sola mutua por id
    [HttpGet("{id}")]
    public async Task<ActionResult<MutuaDTO>> GetMutua(int id)
    {
        var mutua = await _context.Mutuas
            .Where(m => m.MutuaId == id)
            .Select(m => new MutuaDTO
            {
                Nº = m.MutuaId,
                Mutua = m.Mutua1 ?? "",
                Direccion = m.Direccion ?? "",
                CP = m.Cp ?? "",
                Poblacion = m.PoblacionNavigation != null
                            ? m.PoblacionNavigation.Poblacion ?? ""
                            : "",
                Provincia = m.PoblacionNavigation != null && m.PoblacionNavigation.Provincia != null
                            ? m.PoblacionNavigation.Provincia.Provincia ?? ""
                            : "",

                //CAMPOS EXTRA PARA LA FICHA
                NumeroMutua = m.NumeroMutua ?? "",
                RazonSocial = m.RazonSocial ?? "",
                Telefono = m.Telefono ?? "",
                Fax = m.Fax ?? "",
                DireccionElectronica = m.DireccionElectronica ?? "",
                PersonaContacto = m.PersonaContacto ?? ""
            })
            .FirstOrDefaultAsync();

        if (mutua == null)
            return NotFound();

        return Ok(mutua);
    }

    // POST: api/mutuas
    // Crea una nueva mutua recibiendo el modelo completo
    [HttpPost]
    public async Task<ActionResult<MutuaDTO>> CreateMutua(Mutua mutua)
    {
        _context.Mutuas.Add(mutua);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMutua), new { id = mutua.MutuaId }, mutua);
    }

    // PUT: api/mutuas/5
    // Actualiza una mutua existente
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
    // Elimina una mutua por id
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