using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListaDemandasController : ControllerBase
{
    private readonly IListaDemandasService _service;

    public ListaDemandasController(IListaDemandasService service)
    {
        _service = service;
    }

    [HttpPost("lista")]
    public async Task<IActionResult> GetLista(
        [FromBody] FiltrosListaDemandasDTO filtros,
        [FromQuery] int mutuaId = 1)
    {
        var result = await _service.GetListaDemandasAsync(filtros, mutuaId);
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok();
    }
}