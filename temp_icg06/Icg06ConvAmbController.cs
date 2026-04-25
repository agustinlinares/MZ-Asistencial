using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Icg06ConvAmbController : ControllerBase
    {
        private readonly Icg06ConvAmbService _service;

        public Icg06ConvAmbController(Icg06ConvAmbService service)
        {
            _service = service;
        }

        // GET api/Icg06ConvAmb?centroId=1&año=2024
        [HttpGet]
        public async Task<ActionResult<Icg06ConvAmbDTO>> GetByCentroYAño(
            [FromQuery] int centroId,
            [FromQuery] int año)
        {
            var result = await _service.GetByCentroYAñoAsync(centroId, año);
            if (result is null) return NotFound();
            return Ok(result);
        }

        // PUT api/Icg06ConvAmb/42
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Icg06ConvAmbDTO dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (!result) return NotFound();
            return Ok();
        }
    }
}
