using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CentrosPropiosIcgController : ControllerBase
{
    private readonly CentroPropioIcgService _service;

    public CentrosPropiosIcgController(CentroPropioIcgService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<CentroPropioIcgDTO>>> Get()
    {
        var result = await _service.ObtenerCentrosIcg();
        return Ok(result);
    }
}
