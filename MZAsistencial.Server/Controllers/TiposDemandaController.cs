using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiposDemandaController : ControllerBase
    {
        private readonly ITiposDemandaService _service;

        public TiposDemandaController(ITiposDemandaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoDemandaDTO>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("auxiliar")]
        public async Task<ActionResult<IEnumerable<AuxTipoDemandaDTO>>> GetAuxiliar()
        {
            var result = await _service.GetAuxTiposAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<TipoDemandaDTO>> Create(TipoDemandaDTO dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = result.TipoDemandaId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TipoDemandaDTO dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}