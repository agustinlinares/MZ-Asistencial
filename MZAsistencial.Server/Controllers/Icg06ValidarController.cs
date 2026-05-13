using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Icg06ValidarController : ControllerBase
{
    private readonly Icg06ValidarService _service;

    public Icg06ValidarController(Icg06ValidarService service)
    {
        _service = service;
    }

    // GET /api/Icg06Validar/{idIcg}
    // Devuelve el estado actual de Validado
    [HttpGet("{idIcg}")]
    public async Task<IActionResult> Get(int idIcg)
    {
        var validado = await _service.GetValidadoAsync(idIcg);
        return Ok(new { validado });
    }

    // PUT /api/Icg06Validar/{idIcg}
    // Body: { "validado": 1, "usuarioId": 3 }
    [HttpPut("{idIcg}")]
    public async Task<IActionResult> Put(int idIcg, [FromBody] Icg06ValidarRequest request)
    {
        if (request.Validado != 0 && request.Validado != 1)
            return BadRequest("El valor de Validado debe ser 0 o 1.");

        var ok = await _service.SetValidadoAsync(idIcg, request.Validado, request.UsuarioId);
        if (!ok) return NotFound("No se encontró el registro ICG06.");

        return Ok(new { validado = request.Validado });
    }
}

public class Icg06ValidarRequest
{
    public int  Validado  { get; set; }
    public int? UsuarioId { get; set; }
}
