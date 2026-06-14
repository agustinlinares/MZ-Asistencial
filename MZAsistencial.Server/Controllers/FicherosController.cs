using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Helpers;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FicherosController : ControllerBase
    {
        private readonly IFicherosService _service;

        public FicherosController(IFicherosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("areas")]
        public async Task<IActionResult> GetAreas()
        {
            var areas = await _service.GetAreasAsync();
            return Ok(areas);
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id, [FromQuery] int usuarioId)
        {
            var (filePath, nombreFichero) = await _service.GetFilePathAsync(id, usuarioId);

            if (filePath == null || !System.IO.File.Exists(filePath))
                return NotFound(new { message = "Fichero no encontrado." });

            var ext = Path.GetExtension(filePath).ToLowerInvariant();
            var contentType = ext switch
            {
                ".pdf"  => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png"  => "image/png",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                _       => "application/octet-stream",
            };

            var bytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(bytes, contentType, nombreFichero ?? Path.GetFileName(filePath));
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromForm] string? descripcion,
            [FromForm] DateTime? fecha,
            [FromForm] int? areaId,
            IFormFile archivo,
            [FromQuery] int usuarioId)
        {
            if (archivo == null || archivo.Length == 0)
                return BadRequest(new { message = "Debe adjuntar un fichero." });

            var (isValid, error) = await FileValidator.ValidateAsync(archivo);
            if (!isValid)
                return BadRequest(new { message = error });

            var result = await _service.CreateAsync(descripcion, fecha, areaId, archivo, usuarioId);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromForm] string? descripcion,
            [FromForm] DateTime? fecha,
            [FromForm] int? areaId,
            IFormFile? archivo,
            [FromQuery] int usuarioId)
        {
            if (archivo != null && archivo.Length > 0)
            {
                var (isValid, error) = await FileValidator.ValidateAsync(archivo);
                if (!isValid)
                    return BadRequest(new { message = error });
            }

            var result = await _service.UpdateAsync(id, descripcion, fecha, areaId, archivo, usuarioId);
            if (result == null) return NotFound(new { message = "Fichero no encontrado." });
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int usuarioId)
        {
            var ok = await _service.DeleteAsync(id, usuarioId);
            if (!ok) return NotFound(new { message = "Fichero no encontrado." });
            return Ok(new { message = "Fichero eliminado." });
        }
    }
}
