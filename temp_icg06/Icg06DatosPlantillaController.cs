using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using Microsoft.AspNetCore.Mvc;

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

        // GET api/Icg06DatosPlantilla?centroId=1&año=2024
        [HttpGet]
        public async Task<ActionResult<Icg06DatosPlantillaDTO>> GetByCentroYAño(
            [FromQuery] int centroId,
            [FromQuery] int año)
        {
            var result = await _service.GetByCentroYAñoAsync(centroId, año);
            if (result is null) return NotFound();
            return Ok(result);
        }

        // PUT api/Icg06DatosPlantilla/42
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Icg06DatosPlantillaDTO dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (!result) return NotFound();
            return Ok();
        }
    }
}
