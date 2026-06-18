using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IcgConciertosController : ControllerBase
    {
        private readonly IcgConciertosService _service;

        public IcgConciertosController(IcgConciertosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IcgConciertoDto>>> Get()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var exito = await _service.DeleteIcgAsync(id);
                if (!exito) return NotFound(new { message = $"No se encontró el registro ICG07 con ID {id}." });
                
                return NoContent(); // 204 OK
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al eliminar el registro ICG07", details = ex.Message });
            }
        }
    }
}