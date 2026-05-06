using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Icg06DatosPlantillaController : ControllerBase
    {
        private readonly Icg06DatosPlantillaService _service;

        public Icg06DatosPlantillaController(Icg06DatosPlantillaService service)
        {
            _service = service;
        }

        // GET /api/Icg06DatosPlantilla?centroId=...&año=...
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int centroId, [FromQuery] int año)
        {
            var dto = await _service.GetByCentroYAñoAsync(centroId, año);
            return dto is null ? NotFound() : Ok(dto);
        }

        // PUT /api/Icg06DatosPlantilla/{idIcg}
        [HttpPut("{idIcg:int}")]
        public async Task<IActionResult> Put(int idIcg, [FromBody] Icg06DatosPlantillaDTO dto)
        {
            var ok = await _service.UpdateAsync(idIcg, dto);
            return ok ? NoContent() : NotFound();
        }
    }
}
