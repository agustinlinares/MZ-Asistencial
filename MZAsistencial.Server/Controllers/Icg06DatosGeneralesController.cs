using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs.ICG06;
using MZAsistencial.Server.Services.ICG06;

namespace MZAsistencial.Server.Controllers.ICG06;

[ApiController]
[Route("api/[controller]")]
public class Icg06DatosGeneralesController : ControllerBase
{
    private readonly Icg06DatosGeneralesService _service;

    public Icg06DatosGeneralesController(Icg06DatosGeneralesService service)
        => _service = service;

    // GET /api/Icg06DatosGenerales?centroId=...&año=...
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int centroId, [FromQuery] int año)
    {
        var dto = await _service.ObtenerAsync(centroId, año);
        return dto is null ? NotFound() : Ok(dto);
    }

    // PUT /api/Icg06DatosGenerales/{idIcg}
    [HttpPut("{idIcg:int}")]
    public async Task<IActionResult> Put(int idIcg, [FromBody] Icg06DatosGeneralesDto dto)
    {
        try
        {
            await _service.ActualizarAsync(idIcg, dto);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
        catch (ArgumentException ex)    { return BadRequest(ex.Message); }
    }
}
