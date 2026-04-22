using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Icg06EspecialidadController : ControllerBase
    {
        private readonly Icg06EspecialidadService _service;

        public Icg06EspecialidadController(Icg06EspecialidadService service)
        {
            _service = service;
        }

        // GET api/Icg06Especialidad?centroId=1&año=2024
        [HttpGet]
        public async Task<ActionResult<List<Icg06EspecialidadDTO>>> GetByCentroYAño(
            [FromQuery] int centroId,
            [FromQuery] int año)
        {
            var result = await _service.GetByCentroYAñoAsync(centroId, año);
            return Ok(result);
        }

        // POST api/Icg06Especialidad
        [HttpPost]
        public async Task<ActionResult<Icg06EspecialidadDTO>> Create(
            [FromBody] Icg06EspecialidadDTO dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetByCentroYAño), new { centroId = result.CentroId, año = result.Año }, result);
        }

        // PUT api/Icg06Especialidad/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Icg06EspecialidadDTO dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (!result) return NotFound();
            return Ok();
        }

        // DELETE api/Icg06Especialidad/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
