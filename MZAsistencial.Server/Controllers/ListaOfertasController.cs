using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using MZAsistencial.Server.Helpers; 

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

    // POST: api/ListaOfertas/lista
    [HttpPost("lista")]
    public async Task<IActionResult> GetLista(
        [FromBody] FiltrosListaOfertasDTO filtros,
        [FromQuery] int mutuaId = 1)
    {
        var result = await _service.GetListaOfertasAsync(filtros, mutuaId);
        return Ok(result);
    }

    // POST: api/ListaOfertas/{id}/adjuntar
    [HttpPost("{id}/adjuntar")]
    public async Task<IActionResult> AdjuntarDocumento(int id, IFormFile fichero)
    {
        // Validación básica: controlamos que el archivo no llegue vacío
        if (fichero == null || fichero.Length == 0)
        {
            return BadRequest(new { error = "No se ha seleccionado ningún archivo válido." });
        }

        // 🛡️ Filtro de seguridad binaria: inspecciona la extensión y los primeros bytes reales del archivo
        var (isValid, errorMessage) = await FileValidator.ValidateAsync(fichero);

        if (!isValid)
        {
            // Si el archivo es una extensión renombrada falsamente, detiene el proceso aquí
            return BadRequest(new { error = errorMessage });
        }

        try
        {
            // Delegamos el guardado físico y el insert en base de datos al servicio de ofertas
            var ok = await _service.GuardarDocumentoAsync(id, fichero);

            if (!ok)
            {
                return NotFound(new { error = "No se encontró la oferta especificada." });
            }

            return Ok(new { mensaje = "Fichero de oferta adjuntado y verificado con éxito." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error interno al procesar el guardado de la oferta: {ex.Message}" });
        }
    }

    // GET: api/ListaOfertas/estados
    [HttpGet("estados")]
    public async Task<IActionResult> GetEstados()
    {
        var result = await _service.GetEstadosAsync();
        return Ok(result);
    }

    // GET: api/ListaOfertas/años
    [HttpGet("años")]
    public async Task<IActionResult> GetAños()
    {
        var result = await _service.GetAnosAsync();
        return Ok(result);
    }

    // GET: api/ListaOfertas/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    // PUT: api/ListaOfertas/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] OfertaEditDTO dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result) return NotFound();
        return Ok();
    }

    // DELETE: api/ListaOfertas/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok();
    }
}