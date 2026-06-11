using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportarAccessController : ControllerBase
    {
        private readonly IExportarAccessService _service;

        public ExportarAccessController(IExportarAccessService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? mutuaId = null)
        {
            var data = await _service.GetAllAsync(mutuaId);
            return Ok(data);
        }

        [HttpGet("mutuas")]
        public async Task<IActionResult> GetMutuas()
        {
            var mutuas = await _service.GetMutuasAsync();
            return Ok(mutuas.Select(m => new { m.MutuaId, Nombre = m.Mutua1, m.NumeroMutua }));
        }

        [HttpGet("años")]
        public async Task<IActionResult> GetAños()
        {
            var años = await _service.GetAñosAsync();
            return Ok(años);
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id)
        {
            var (filePath, nombreFichero) = await _service.GetFilePathAsync(id);

            if (filePath == null || !System.IO.File.Exists(filePath))
                return NotFound(new { message = "Fichero no encontrado en el servidor." });

            var bytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(bytes, "application/msaccess", nombreFichero ?? Path.GetFileName(filePath));
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateFicheroGeneradoRequest request,
            [FromQuery] int usuarioId)
        {
            var result = await _service.CreateAsync(request.MutuaId, request.Año, request.TipoCentroId, usuarioId);
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

    public class CreateFicheroGeneradoRequest
    {
        public int MutuaId { get; set; }
        public int Año { get; set; }
        public int TipoCentroId { get; set; }
    }
}
