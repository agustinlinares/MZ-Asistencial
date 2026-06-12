using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListadoPropiosIcgController : ControllerBase
{
    private readonly ListadoPropiosIcgService _service;
    private readonly Icg06ValidarService      _validarService;
    private readonly Icg06CrearService        _crearService;

    public ListadoPropiosIcgController(
        ListadoPropiosIcgService service,
        Icg06ValidarService      validarService,
        Icg06CrearService        crearService)
    {
        _service        = service;
        _validarService = validarService;
        _crearService   = crearService;
    }

    // GET /api/ListadoPropiosIcg
    [HttpGet]
    public async Task<ActionResult<List<ListadoPropiosIcgDTO>>> Get(
        [FromQuery] int? año    = null,
        [FromQuery] int? mutuaId = null)
    {
        var result = await _service.GetAllAsync(año, mutuaId);
        return Ok(result);
    }

    // GET /api/ListadoPropiosIcg/{centroId}/{año}
    [HttpGet("{centroId}/{año}")]
    public async Task<ActionResult<ListadoPropiosIcgDTO>> GetByCentroYAño(int centroId, int año)
    {
        var result = await _service.GetByCentroYAñoAsync(centroId, año);
        if (result is null) return NotFound();
        return Ok(result);
    }

    // PUT /api/ListadoPropiosIcg/{idIcg}/validar
    [HttpPut("{idIcg}/validar")]
    public async Task<IActionResult> Validar(int idIcg, [FromBody] ValidarICGRequest request)
    {
        var ok = await _validarService.SetValidadoAsync(idIcg, request.Validado, request.UsuarioId);
        if (!ok) return NotFound();
        return NoContent();
    }

    // DELETE /api/ListadoPropiosIcg/{idIcg}
    [HttpDelete("{idIcg}")]
    public async Task<IActionResult> Delete(int idIcg, [FromQuery] int? usuarioId = null)
    {
        var ok = await _crearService.EliminarAsync(idIcg, usuarioId);
        if (!ok) return NotFound();
        return NoContent();
    }
}

// ─── DTO para el body del PUT validar ────────────────────────────────────────
public class ValidarICGRequest
{
    public int  Validado  { get; set; }
    public int? UsuarioId { get; set; }
}