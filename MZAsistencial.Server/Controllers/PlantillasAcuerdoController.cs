using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Helpers;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantillasAcuerdoController : ControllerBase
    {
        private readonly IPlantillasAcuerdoService _service;

        public PlantillasAcuerdoController(IPlantillasAcuerdoService service)
        {
            _service = service;
        }

        // GET: api/PlantillasAcuerdo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlantillasAcuerdosDTO>>> GetPlantillasAcuerdos()
        {
            var acuerdos = await _service.GetPlantillasAcuerdosAsync();
            return Ok(acuerdos);
        }

        // GET: api/PlantillasAcuerdo/mutuas
        [HttpGet("mutuas")]
        public async Task<ActionResult<IEnumerable<object>>> GetMutuasForPlantillas()
        {
            var mutuas = await _service.GetMutuasAsync();
            return Ok(mutuas.Select(m => new { mutua = m }));
        }

        // POST: api/PlantillasAcuerdo
        [HttpPost]
        public async Task<IActionResult> PostPlantillaAcuerdo([FromForm] PlantillaUploadDTO dto)
        {
            if (dto == null) return BadRequest("Los datos no son válidos.");
            if (dto.File != null)
            {
                var (isValid, error) = await MZAsistencial.Server.Helpers.FileValidator.ValidateAsync(dto.File);
                if (!isValid) return BadRequest(error);
            }

            if (dto.File != null)
            {
                var (isValid, error) = await FileValidator.ValidateAsync(dto.File);
                if (!isValid)
                    return BadRequest(new { mensaje = error });
            }

            var success = await _service.CreatePlantillaAcuerdoAsync(dto);

            if (success)
                return Ok(new { mensaje = "Plantilla creada correctamente." });

            return BadRequest("Error al crear la plantilla.");
        }

        // POST: api/PlantillasAcuerdo/procesar
        [HttpPost("procesar")]
        public async Task<IActionResult> PostProcesarPlantillas()
        {
            var success = await _service.ProcessPlantillasAsync();

            if (success)
                return Ok(new { mensaje = "Plantillas procesadas correctamente." });

            return BadRequest("Error al procesar las plantillas o no hay plantillas pendientes.");
        }

        // PUT: api/PlantillasAcuerdo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlantillaAcuerdo(int id, [FromBody] PlantillasAcuerdosDTO dto)
        {
            if (dto == null) return BadRequest("Datos no válidos.");

            var success = await _service.UpdatePlantillaAcuerdoAsync(id, dto);

            if (success)
                return Ok(new { mensaje = "Plantilla actualizada correctamente." });

            return NotFound($"No se ha encontrado la plantilla con ID {id}.");
        }

        // DELETE: api/PlantillasAcuerdo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlantillaAcuerdo(int id)
        {
            var success = await _service.DeletePlantillaAcuerdoAsync(id);

            if (success)
                return Ok(new { mensaje = "Plantilla eliminada correctamente." });

            return NotFound($"No se ha encontrado la plantilla con ID {id}.");
        }
    }
}
