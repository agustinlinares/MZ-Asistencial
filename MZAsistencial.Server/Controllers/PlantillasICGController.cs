using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MZAsistencial.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlantillasICGController : ControllerBase
{
    private readonly PlantillasICGService _service;

    public PlantillasICGController(PlantillasICGService service)
    {
        _service = service;
    }

    // GET /api/PlantillasICG/informes
    [HttpGet("informes")]
    public async Task<ActionResult<List<PlantillasICGDTO>>> GetInformes([FromQuery] int? mutuaId, [FromQuery] int? anio)
    {
        try
        {
            var result = await _service.GetInformesAsync(mutuaId, anio);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // GET /api/PlantillasICG/generar
    [HttpGet("generar")]
    public async Task<IActionResult> GenerarPlantilla([FromQuery] int? mutuaId, [FromQuery] int? anio, [FromQuery] string tipo, [FromQuery] string formato)
    {
        try
        {
            var fileBytes = await _service.GenerarPlantillaAsync(mutuaId, anio, tipo, formato);
            var mimeType = formato.ToUpper() == "XML" ? "application/xml" : "text/csv";
            return File(fileBytes, mimeType, $"Plantilla_{tipo}_{anio}.{formato.ToLower()}");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // POST /api/PlantillasICG/subir
    [HttpPost("subir")]
    public async Task<IActionResult> SubirPlantilla([FromForm] IFormFile fichero, [FromForm] int? mutuaId, [FromForm] int? anio, [FromForm] string tipoICG)
    {
        try
        {
            if (fichero == null || fichero.Length == 0)
                return BadRequest("No se adjuntó ningún fichero válido.");

            var dto = await _service.SubirPlantillaAsync(fichero, mutuaId, anio, tipoICG);
            return Ok(dto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // GET /api/PlantillasICG/iniciales
    [HttpGet("iniciales")]
    public async Task<IActionResult> GetDatosIniciales()
    {
        try
        {
            var result = await _service.GetDatosInicialesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // POST /api/PlantillasICG/procesar
    [HttpPost("procesar")]
    public async Task<IActionResult> ProcesarPlantillas()
    {
        try
        {
            var procesados = await _service.ProcesarPlantillasAsync();
            return Ok(new { Message = $"Se han procesado {procesados} plantillas correctamente." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // DELETE /api/PlantillasICG/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlantilla(int id)
    {
        try
        {
            var result = await _service.EliminarPlantillaAsync(id);
            if (!result) return NotFound();
            return Ok(new { Message = "Informe eliminado correctamente." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}
