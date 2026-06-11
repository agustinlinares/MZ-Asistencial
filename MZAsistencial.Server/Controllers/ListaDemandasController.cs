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
        Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        Response.Headers["Pragma"] = "no-cache";
        Console.WriteLine($">>> GetLista - Tipo: {filtros.Tipo} Año: {filtros.Año}");
        var result = await _service.GetListaDemandasAsync(filtros, mutuaId);
        var lista = result.ToList();
        Console.WriteLine($">>> Total filas: {lista.Count} - IDs: {string.Join(",", lista.Select(x => x.DemandaId).Distinct())}");
        return Ok(lista);
    }

    [HttpPost("lista-test")]
    public async Task<IActionResult> GetListaTest(
      [FromBody] FiltrosListaDemandasDTO filtros,
      [FromQuery] int mutuaId = 1)
    {
        Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        Console.WriteLine($">>> GetListaTest - Tipo: {filtros.Tipo} Año: {filtros.Año}");
        var result = await _service.GetListaDemandasAsync(filtros, mutuaId);
        var lista = result.ToList();
        Console.WriteLine($">>> Test Total filas: {lista.Count} - IDs: {string.Join(",", lista.Select(x => x.DemandaId).Distinct())}");
        return Ok(lista);
    }

    [HttpGet("estados")]
    public async Task<IActionResult> GetEstados()
    {
        var result = await _service.GetEstadosAsync();
        return Ok(result);
    }

    [HttpGet("anos")]
    public async Task<IActionResult> GetAños()
    {
        var result = await _service.GetAñosAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DemandaUpdateDTO dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok();
    }
}