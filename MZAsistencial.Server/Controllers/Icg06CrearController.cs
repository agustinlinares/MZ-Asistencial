using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Icg06CrearController : ControllerBase
{
    private readonly Icg06CrearService _service;

    public Icg06CrearController(Icg06CrearService service)
    {
        _service = service;
    }

    // POST /api/Icg06Crear
    // Body: { "centroId": 1, "año": 2025, "usuarioId": 3 }
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Icg06CrearRequest request)
    {
        if (request.CentroId <= 0 || request.Año <= 0)
            return BadRequest("CentroId y Año son obligatorios.");

        var existe = await _service.ExisteAsync(request.CentroId, request.Año);
        if (existe)
            return Conflict("Ya existe un registro ICG06 para este centro y año.");

        var idIcg = await _service.CrearAsync(request.CentroId, request.Año, request.UsuarioId);
        return Ok(new { idIcg });
    }
}

public class Icg06CrearRequest
{
    public int  CentroId  { get; set; }
    public int  Año       { get; set; }
    public int? UsuarioId { get; set; }
}
