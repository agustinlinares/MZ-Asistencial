using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Icg06HosController : ControllerBase
    {
        private readonly Icg06HosService _service;
        public Icg06HosController(Icg06HosService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int centroId, [FromQuery] int año)
        {
            var dto = await _service.GetByCentroYAñoAsync(centroId, año);
            return dto is null ? NotFound() : Ok(dto);
        }

        [HttpPut("{idIcg:int}")]
        public async Task<IActionResult> Put(int idIcg, [FromBody] Icg06HosDTO dto)
        {
            var ok = await _service.UpdateAsync(idIcg, dto);
            return ok ? NoContent() : NotFound();
        }
    }
}
