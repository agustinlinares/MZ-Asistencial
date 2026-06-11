using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AcreditacionesIndividualesController : ControllerBase
    {
        private readonly IAcreditacionesIndividualesService _service;

        public AcreditacionesIndividualesController(IAcreditacionesIndividualesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int usuarioId = 0, [FromQuery] int? mutuaId = null)
        {
            if (usuarioId > 0)
                await _service.LogAccesoAsync(usuarioId);
            var data = await _service.GetAllAsync(mutuaId);
            return Ok(data);
        }

        [HttpGet("max-year")]
        public async Task<IActionResult> GetMaxYear()
        {
            var año = await _service.GetMaxAñoAsync();
            return Ok(new { año });
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id)
        {
            var (filePath, nombreFichero) = await _service.GetFilePathAsync(id);

            if (filePath == null || !System.IO.File.Exists(filePath))
                return NotFound(new { message = "Fichero no encontrado." });

            var contentType = filePath.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase)
                ? "application/pdf"
                : "application/octet-stream";

            var bytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(bytes, contentType, nombreFichero ?? Path.GetFileName(filePath));
        }
    }
}
