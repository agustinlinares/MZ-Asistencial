using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CitacionesController : ControllerBase
{
    private readonly ICitacionesService _service;

    public CitacionesController(ICitacionesService service)
    {
        _service = service;
    }

    [HttpGet("solicitadas/{mutuaId:int}")]
    public async Task<ActionResult<List<CitacionDTO>>> GetSolicitadas(int mutuaId, [FromQuery] CitacionFilter filter)
    {
        if (mutuaId <= 0) return BadRequest(new { error = "El ID de mutua debe ser un número positivo" });
        var result = await _service.GetSolicitadasAsync(mutuaId, filter);
        return Ok(result);
    }

    [HttpGet("recibidas/{mutuaId:int}")]
    public async Task<ActionResult<List<CitacionDTO>>> GetRecibidas(int mutuaId, [FromQuery] CitacionFilter filter)
    {
        if (mutuaId <= 0) return BadRequest(new { error = "El ID de mutua debe ser un número positivo" });
        var result = await _service.GetRecibidasAsync(mutuaId, filter);
        return Ok(result);
    }

    [HttpPut("{id:int}/estado")]
    public async Task<IActionResult> UpdateEstado(int id, [FromQuery] int estadoId, [FromQuery] string contestacion)
    {
        if (estadoId <= 0) return BadRequest(new { error = "El estado no es válido" });
        var result = await _service.UpdateEstadoAsync(id, estadoId, contestacion, User);
        if (!result) return NotFound(new { error = $"No se encontró la citación con ID {id} o no tiene permisos." });
        return Ok(new { success = true });
    }

    [HttpPut("{id:int}/rechazar")]
    public async Task<IActionResult> UpdateRechazo(int id, [FromQuery] string motivo)
    {
        if (string.IsNullOrWhiteSpace(motivo))
            return BadRequest(new { error = "Debe indicar un motivo para el rechazo" });

        var result = await _service.UpdateRechazoAsync(id, motivo, User);
        if (!result) return NotFound(new { error = $"No se encontró la citación con ID {id} o no tiene permisos." });
        return Ok(new { success = true });
    }

    [HttpPost("{mutuaId:int}")]
    public async Task<IActionResult> Create(int mutuaId, [FromBody] CitacionDTO dto)
    {
        if (mutuaId <= 0) return BadRequest(new { error = "El ID de mutua debe ser un número positivo" });

        // Las anotaciones del DTO (Required, Range, StringLength) se validan aquí
        if (!ModelState.IsValid)
        {
            var errores = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);
            return BadRequest(new { errores });
        }

        var result = await _service.CreateSolicitudAsync(mutuaId, dto, User);
        if (!result) return NotFound(new { error = "La mutua indicada no existe o no tiene permisos para solicitar." });
        return Ok(new { success = true });
    }

    [HttpPost("seed/{mutuaId}")]
    public async Task<IActionResult> Seed(int mutuaId)
    {
        var count = await _service.SeedDataAsync(mutuaId);
        return Ok(new { message = $"{count} citaciones creadas para la mutua {mutuaId}" });
    }

    // Document and history methods have been removed due to corresponding service method removal.
}
