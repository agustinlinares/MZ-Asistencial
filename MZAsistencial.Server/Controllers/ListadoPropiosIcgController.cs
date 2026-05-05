using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListadoPropiosIcgController : ControllerBase
{
    private readonly ListadoPropiosIcgService _service;

    public ListadoPropiosIcgController(ListadoPropiosIcgService service)
    {
        _service = service;
    }

    // GET /api/ListadoPropiosIcg
    // GET /api/ListadoPropiosIcg?año=2023
    // GET /api/ListadoPropiosIcg?año=2023&mutuaId=1
    [HttpGet]
    public async Task<ActionResult<List<ListadoPropiosIcgDTO>>> Get(
        [FromQuery] int? año = null,
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
}
