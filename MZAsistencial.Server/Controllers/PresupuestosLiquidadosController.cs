using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PresupuestosLiquidadosController : ControllerBase
    {
        private readonly IPresupuestosLiquidadosService _service;

        public PresupuestosLiquidadosController(IPresupuestosLiquidadosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _service.ObtenerTodosAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.ObtenerPorIdAsync(id);
            if (result == null) return NotFound();
            
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PresupuestoLiquidadoFormDTO dto)
        {
            try
            {
                var id = await _service.InsertarAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = id }, dto);
            }
            catch (InvalidOperationException ex)
            {
                // Capturamos la validación de duplicados (misma mutua y año)
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] PresupuestoLiquidadoFormDTO dto)
        {
            if (id != dto.IdPresupuesto) return BadRequest();

            var success = await _service.ActualizarAsync(dto);
            if (!success) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.EliminarAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }
    }
}