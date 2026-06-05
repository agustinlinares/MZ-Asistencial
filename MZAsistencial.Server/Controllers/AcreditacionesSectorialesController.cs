using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AcreditacionesSectorialesController : ControllerBase
    {
        private readonly IAcreditacionesSectorialesService _service;

        public AcreditacionesSectorialesController(IAcreditacionesSectorialesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? mutuaId = null)
        {
            var data = await _service.GetAllAsync(mutuaId);
            return Ok(data);
        }

        [HttpPost("seed-test")]
        public async Task<IActionResult> SeedTest()
        {
            var (ficheroId, message) = await _service.CreateTestRecordAsync();
            if (ficheroId == null)
                return BadRequest(new { message });
            return Ok(new { ficheroId, message });
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
            var fileName = Path.GetFileName(filePath);
            return File(bytes, contentType, nombreFichero ?? fileName);
        }
    }
}
