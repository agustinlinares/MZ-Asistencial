using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CitacionesController : ControllerBase
{
    private readonly ICitacionesService _service;

    public CitacionesController(ICitacionesService service)
    {
        _service = service;
    }

    [HttpGet("solicitadas/{mutuaId:int}")]
    public async Task<IActionResult> GetSolicitadas(int mutuaId, DataSourceLoadOptions loadOptions, [FromQuery] CitacionFilter filter)
    {
        if (mutuaId <= 0) return BadRequest(new { error = "El ID de mutua debe ser un número positivo" });
        var result = await _service.GetSolicitadasAsync(mutuaId, filter, loadOptions);
        return Ok(result);
    }

    [HttpGet("recibidas/{mutuaId:int}")]
    public async Task<IActionResult> GetRecibidas(int mutuaId, DataSourceLoadOptions loadOptions, [FromQuery] CitacionFilter filter)
    {
        if (mutuaId <= 0) return BadRequest(new { error = "El ID de mutua debe ser un número positivo" });
        var result = await _service.GetRecibidasAsync(mutuaId, filter, loadOptions);
        return Ok(result);
    }

    [HttpPut("{id:int}/estado")]
    public async Task<IActionResult> UpdateEstado(int id, [FromQuery] int estadoId, [FromQuery] string contestacion)
    {
        if (estadoId <= 0) return BadRequest(new { error = "El estado no es válido" });
        var result = await _service.UpdateEstadoAsync(id, estadoId, contestacion, User);
        if (!result) return NotFound(new { error = $"No se encontró la citación con ID {id} o no tiene permisos." });
        return Ok(new { success = true });
    }

    [HttpPut("{id:int}/rechazar")]
    public async Task<IActionResult> UpdateRechazo(int id, [FromQuery] string motivo, [FromQuery] int estadoId = 6)
    {
        if (string.IsNullOrWhiteSpace(motivo))
            return BadRequest(new { error = "Debe indicar un motivo para el rechazo" });

        var result = await _service.UpdateRechazoAsync(id, motivo, estadoId, User);
        if (!result) return NotFound(new { error = $"No se encontró la citación con ID {id} o no tiene permisos." });
        return Ok(new { success = true });
    }

    [HttpPost("{mutuaId:int}")]
    public async Task<IActionResult> Create(int mutuaId, [FromBody] CitacionDTO dto)
    {
        if (mutuaId <= 0) return BadRequest(new { error = "El ID de mutua debe ser un número positivo" });

        // Las anotaciones del DTO (Required, Range, StringLength) se validan aquí
        if (!ModelState.IsValid)
        {
            var errores = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);
            return BadRequest(new { errores });
        }

        var result = await _service.CreateSolicitudAsync(mutuaId, dto, User);
        if (!result) return NotFound(new { error = "La mutua indicada no existe o no tiene permisos para solicitar." });
        return Ok(new { success = true });
    }

    [HttpPost("seed/{mutuaId}")]
    public async Task<IActionResult> Seed(int mutuaId)
    {
        var count = await _service.SeedDataAsync(mutuaId);
        return Ok(new { message = $"{count} citaciones creadas para la mutua {mutuaId}" });
    }

    [HttpGet("{id:int}/documentos")]
    public async Task<IActionResult> GetDocumentos(int id)
    {
        var docs = await _service.GetDocumentosAsync(id);
        return Ok(docs);
    }

    [HttpGet("{id:int}/documentos/{docId:int}")]
    public async Task<IActionResult> DownloadDocumento(int id, int docId)
    {
        var doc = await _service.GetDocumentoByIdAsync(docId);
        if (doc == null || doc.CitacionId != id)
            return NotFound(new { error = "Documento no encontrado" });

        var content = System.Text.Encoding.UTF8.GetBytes($"Contenido simulado del archivo {doc.Nombre}");
        return File(content, "application/octet-stream", doc.Nombre ?? "archivo");
    }

    [HttpPost("{id:int}/documentos")]
    public async Task<IActionResult> UploadDocumento(int id, [FromForm] List<Microsoft.AspNetCore.Http.IFormFile> files)
    {
        if (files == null || files.Count == 0)
            return BadRequest(new { error = "No se ha subido ningún archivo válido" });

        var mutuaIdClaim = User.Claims.FirstOrDefault(c => c.Type == "MutuaId")?.Value;
        var usuarioIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        
        int mutuaId = string.IsNullOrEmpty(mutuaIdClaim) ? 1 : int.Parse(mutuaIdClaim);
        int usuarioId = string.IsNullOrEmpty(usuarioIdClaim) ? 1 : int.Parse(usuarioIdClaim);

        var uploadedFiles = new List<string>();

        foreach (var file in files)
        {
            if (file.Length > 0)
            {
                var (isValid, error) = await MZAsistencial.Server.Helpers.FileValidator.ValidateAsync(file);
                if (!isValid) return BadRequest(new { error });

                string rutaFisica = $"/uploads/citaciones/{id}/{file.FileName}";
                await _service.UploadDocumentoAsync(id, file.FileName, rutaFisica, mutuaId, usuarioId);
                uploadedFiles.Add(file.FileName);
            }
        }

        return Ok(new { success = true, filenames = uploadedFiles });
    }
}
