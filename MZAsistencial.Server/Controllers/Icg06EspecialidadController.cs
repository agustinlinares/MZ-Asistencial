using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Icg06EspecialidadController : ControllerBase
{
    private readonly Icg06EspecialidadService _service;

    public Icg06EspecialidadController(Icg06EspecialidadService service)
    {
        _service = service;
    }

    // GET /api/Icg06Especialidad?centroId=1&año=2025
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int centroId, [FromQuery] int año)
    {
        var result = await _service.GetByCentroYAñoAsync(centroId, año);
        return Ok(result);
    }

    // POST /api/Icg06Especialidad
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Icg06EspecialidadDTO dto)
    {
        var created = await _service.CreateAsync(dto);
        return Ok(created);
    }

    // PUT /api/Icg06Especialidad/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Icg06EspecialidadDTO dto)
    {
        var ok = await _service.UpdateAsync(id, dto);
        if (!ok) return NotFound();
        return NoContent();
    }

    // DELETE /api/Icg06Especialidad/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound();
        return NoContent();
    }
}
