using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListaOfertasController : ControllerBase
{
    private readonly IListaOfertasService _service;

    public ListaOfertasController(IListaOfertasService service)
    {
        _service = service;
    }

    [HttpPost("lista")]
    public async Task<IActionResult> GetLista(
        [FromBody] FiltrosListaOfertasDTO filtros,
        [FromQuery] int mutuaId = 1)  
    {
        var result = await _service.GetListaOfertasAsync(filtros, mutuaId);
        return Ok(result);
    }

    [HttpGet("estados")]
    public async Task<IActionResult> GetEstados()
    {
        var result = await _service.GetEstadosAsync();
        return Ok(result);
    }

    [HttpGet("años")]
    public async Task<IActionResult> GetAños()
    {
        var result = await _service.GetAñosAsync();
        return Ok(result);
    }
}