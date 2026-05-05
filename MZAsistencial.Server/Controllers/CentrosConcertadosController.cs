using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CentrosConcertadosController : ControllerBase
    {
        private readonly ICentrosConcertadosService _service;

        public CentrosConcertadosController(ICentrosConcertadosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CentrosConcertadoDTO>>> Get()
        {
            var centros = await _service.GetCabecerasAsync();
            return Ok(centros);
        }

        [HttpPost]
        public async Task<ActionResult<CentrosConcertadoDTO>> Post([FromBody] CentrosConcertadoDTO dto)
        {
            try
            {
                var nuevoCentro = await _service.CreateCentroAsync(dto);
                // Devuelve un 201 Created
                return CreatedAtAction(nameof(Get), new { id = nuevoCentro.Centro_id }, nuevoCentro); 
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CentrosConcertadoDTO dto)
        {
            if (id != dto.Centro_id)
            {
                return BadRequest("El ID de la ruta no coincide con el ID del cuerpo de la petición.");
            }

            try
            {
                var actualizado = await _service.UpdateCentroAsync(id, dto);
                if (!actualizado)
                {
                    return NotFound($"No se encontró el centro con ID {id}");
                }
                return NoContent(); // 204 No Content es el estándar de éxito para un PUT
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("{centroId}/Mutuas")]
        public async Task<ActionResult<IEnumerable<MutuaAsignadaDTO>>> GetMutuasAsignadas(int centroId)
        {
            try
            {
                var mutuas = await _service.GetMutuasPorCentroAsync(centroId);
                return Ok(mutuas);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
