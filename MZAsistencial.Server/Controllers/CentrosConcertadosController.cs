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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var exito = await _service.DeleteCentroAsync(id);
                
                if (!exito) 
                    return NotFound(new { message = "No se encontró el centro para dar de baja." });

                // Devuelve un 204 NoContent, que es el estándar HTTP correcto para un DELETE exitoso sin cuerpo de respuesta
                return NoContent(); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al intentar dar de baja el centro", details = ex.Message });
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

        [HttpGet("{id}/Especialidades")]
        public async Task<IActionResult> GetEspecialidades(int id)
        {
            try
            {
                var especialidades = await _service.GetEspecialidadesByCentroAsync(id);
                return Ok(especialidades);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener las especialidades", details = ex.Message });
            }
        }

        [HttpPut("{id}/Reactivar")]
        public async Task<IActionResult> ReactivarCentro(int id)
        {
            try
            {
                await _service.ReactivarCentroAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al reactivar: {ex.Message}");
            }
        }
    }
}
