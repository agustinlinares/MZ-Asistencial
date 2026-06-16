using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using MZAsistencial.Server.Helpers;

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

    // POST: api/ListaDemandas/lista
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

    // POST: api/ListaDemandas/{id}/adjuntar
    [HttpPost("{id}/adjuntar")]
    public async Task<IActionResult> AdjuntarDocumento(int id, IFormFile fichero)
    {
        // 1. Validación básica de presencia física del archivo
        if (fichero == null || fichero.Length == 0)
        {
            return BadRequest(new { error = "No se ha seleccionado ningún archivo válido." });
        }

        // 2. FILTRO DE SEGURIDAD: Analiza extensión y firma binaria real (Magic Numbers)
        var (isValid, errorMessage) = await FileValidator.ValidateAsync(fichero);

        if (!isValid)
        {
            // Si la extensión fue alterada o el archivo no es seguro, frena la subida de inmediato
            return BadRequest(new { error = errorMessage });
        }

        try
        {
            // 3. Persistencia en el entorno de almacenamiento
            var ok = await _service.GuardarDocumentoAsync(id, fichero);
            if (!ok) return NotFound(new {error = "No se encontró la demanda especificada." });

            return Ok(new { mensaje = "Fichero adjuntado y verificado con éxito." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error interno al procesar el guardado: {ex.Message}" });
        }
    }

    // GET: api/ListaDemandas/documento/{nombreFisico}
    [HttpGet("documento/{nombreFisico}")]
    public IActionResult DescargarDocumento(string nombreFisico)
    {
        // A) Apuntamos a la carpeta física local del servidor
        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        var filePath = Path.Combine(folderPath, nombreFisico);

        // B) Control de seguridad: Si el archivo no existe en el disco, evitamos un colapso
        if (!System.IO.File.Exists(filePath))
        {
            return NotFound(new { error = "El archivo físico solicitado no existe en el servidor." });
        }

        // C) Leemos los bytes binarios del archivo
        var fileBytes = System.IO.File.ReadAllBytes(filePath);

        // D) Detectamos la extensión para que el navegador sepa si abrirlo directamente (PDF/Imágenes) o descargarlo
        var ext = Path.GetExtension(nombreFisico).ToLowerInvariant();
        string contentType = ext switch
        {
            ".pdf" => "application/pdf",
            ".png" => "image/png",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            _ => "application/octet-stream" // Tipo genérico para forzar descarga si es raro
        };

        // Retornamos el archivo binario puro hacia el navegador
        return File(fileBytes, contentType);
    }

    // POST: api/ListaDemandas/lista-test
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

    // GET: api/ListaDemandas/estados
    [HttpGet("estados")]
    public async Task<IActionResult> GetEstados()
    {
        var result = await _service.GetEstadosAsync();
        return Ok(result);
    }

    // GET: api/ListaDemandas/anos
    [HttpGet("anos")]
    public async Task<IActionResult> GetAños()
    {
        var result = await _service.GetAñosAsync();
        return Ok(result);
    }

    // GET: api/ListaDemandas/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    // PUT: api/ListaDemandas/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DemandaUpdateDTO dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result) return NotFound();
        return Ok();
    }

    // DELETE: api/ListaDemandas/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok();
    }
}