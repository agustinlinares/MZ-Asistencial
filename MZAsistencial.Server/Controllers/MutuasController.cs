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
            .Include(m => m.PoblacionNavigation)
                .ThenInclude(p => p.Provincia) 
            .Select(m => new MutuaDTO
            {
                NumeroId    = m.MutuaId,
                NumeroMutua = m.NumeroMutua ?? "", //Columna Extra
                Mutua     = m.Mutua1 ?? "", //Nombre
                Direccion = m.Direccion ?? "",
                CP = m.Cp ?? "",
                Poblacion = m.PoblacionNavigation != null
                            ? m.PoblacionNavigation.Poblacion ?? ""
                            : "",
                Provincia = m.PoblacionNavigation != null && m.PoblacionNavigation.Provincia != null
                            //? m.PoblacionNavigation.Provincia.Provincia1 ?? ""
                            ? m.PoblacionNavigation.Provincia.Provincia.Trim() ?? ""
                            : ""
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
                NumeroId = m.MutuaId,
                Mutua = m.Mutua1 ?? "",
                Direccion = m.Direccion ?? "",
                CP = m.Cp ?? "",
                PoblacionId = m.PoblacionId, //
                Poblacion = m.PoblacionNavigation != null
                            ? m.PoblacionNavigation.Poblacion ?? ""
                            : "",
                Provincia = m.PoblacionNavigation != null && m.PoblacionNavigation.Provincia != null
                            ? m.PoblacionNavigation.Provincia.Provincia.Trim() ?? ""
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
    // Crea una nueva mutua recibiendo los campos del DTO
    [HttpPost]
    public async Task<ActionResult<MutuaDTO>> PostMutua(MutuaDTO dto)
    {
        var mutua = new Mutua
        {
            Mutua1 = dto.Mutua,
            RazonSocial = dto.RazonSocial,
            Direccion = dto.Direccion,
            Cp = dto.CP,
            Telefono = dto.Telefono,
            Fax = dto.Fax,
            DireccionElectronica = dto.DireccionElectronica,
            PersonaContacto = dto.PersonaContacto,
            NumeroMutua = dto.NumeroMutua,
            PoblacionId = dto.PoblacionId // IMPORTANTE si se usa
        };

        _context.Mutuas.Add(mutua);
        await _context.SaveChangesAsync();

        return Ok(mutua);
    }

    // PUT: api/mutuas/5
    // Actualiza una mutua existente
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMutua(int id, MutuaDTO dto)
    {
    // 👇 Añade esto para ver qué llega
    Console.WriteLine($"PUT recibido - id URL: {id}, dto.NumeroId: {dto?.NumeroId}, dto.Mutua: {dto?.Mutua}");

        var mutua = await _context.Mutuas.FindAsync(id);
        if (mutua == null) return NotFound();
        if (id != dto?.NumeroId) return BadRequest();

        // Solo actualizamos los campos editables
        mutua.Mutua1 = dto.Mutua;
        mutua.Direccion = dto.Direccion;
        mutua.Cp = dto.CP;
        mutua.PoblacionId = dto.PoblacionId;//
        mutua.RazonSocial = dto.RazonSocial;
        mutua.Telefono = dto.Telefono;
        mutua.Fax = dto.Fax;
        mutua.DireccionElectronica = dto.DireccionElectronica;
        mutua.PersonaContacto = dto.PersonaContacto;
        mutua.NumeroMutua = dto.NumeroMutua;

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