using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Icg06PoblacionProtegidaController : ControllerBase
    {
        private readonly Icg06PoblacionProtegidaService _service;

        public Icg06PoblacionProtegidaController(Icg06PoblacionProtegidaService service)
        {
            _service = service;
        }

        // GET /api/Icg06PoblacionProtegida?centroId=...&año=...
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int centroId, [FromQuery] int año)
        {
            var dto = await _service.GetByCentroYAñoAsync(centroId, año);
            return dto is null ? NotFound() : Ok(dto);
        }

        // PUT /api/Icg06PoblacionProtegida/{idIcg}
        [HttpPut("{idIcg:int}")]
        public async Task<IActionResult> Put(int idIcg, [FromBody] Icg06PoblacionProtegidaDTO dto)
        {
            var ok = await _service.UpdateAsync(idIcg, dto);
            return ok ? NoContent() : NotFound();
        }
    }
}
