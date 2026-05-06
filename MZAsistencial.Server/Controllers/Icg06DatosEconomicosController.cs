using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Icg06DatosEconomicosController : ControllerBase
    {
        private readonly Icg06DatosEconomicosService _service;

        public Icg06DatosEconomicosController(Icg06DatosEconomicosService service)
        {
            _service = service;
        }

        // GET /api/Icg06DatosEconomicos?centroId=...&año=...
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int centroId, [FromQuery] int año)
        {
            var dto = await _service.GetByCentroYAñoAsync(centroId, año);
            return dto is null ? NotFound() : Ok(dto);
        }

        // PUT /api/Icg06DatosEconomicos/{idIcg}
        [HttpPut("{idIcg:int}")]
        public async Task<IActionResult> Put(int idIcg, [FromBody] Icg06DatosEconomicosDTO dto)
        {
            var ok = await _service.UpdateAsync(idIcg, dto);
            return ok ? NoContent() : NotFound();
        }
    }
}
