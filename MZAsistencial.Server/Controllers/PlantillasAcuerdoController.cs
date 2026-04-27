using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantillasAcuerdoController : ControllerBase
    {
        private readonly IPlantillasAcuerdoService _service;
        private readonly MZAsistencial.Server.Data.MZAsistencialContext _context;

        public PlantillasAcuerdoController()
        {
            var optionsBuilder = new Microsoft.EntityFrameworkCore.DbContextOptionsBuilder<MZAsistencial.Server.Data.MZAsistencialContext>();
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=MZAsistencial;Trusted_Connection=True;TrustServerCertificate=True");
            
            _context = new MZAsistencial.Server.Data.MZAsistencialContext(optionsBuilder.Options);
            _service = new PlantillasAcuerdoService(_context);
        }

        // GET: api/PlantillasAcuerdo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlantillasAcuerdosDTO>>> GetPlantillasAcuerdos()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            var acuerdos = await _service.GetPlantillasAcuerdosAsync();
            return Ok(acuerdos);
        }

        // GET: api/PlantillasAcuerdo/mutuas
        [HttpGet("mutuas")]
        public async Task<ActionResult<IEnumerable<object>>> GetMutuasForPlantillas()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            var mutuas = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(
                System.Linq.Queryable.Select(_context.Mutuas, m => new { mutua = m.Mutua1 })
            );
            return Ok(mutuas);
        }

        // POST: api/PlantillasAcuerdo
        [HttpPost]
        public async Task<IActionResult> PostPlantillaAcuerdo([FromForm] PlantillaUploadDTO dto)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            if (dto == null) return BadRequest("Los datos no son válidos");

            var success = await _service.CreatePlantillaAcuerdoAsync(dto);
            
            if (success)
                return Ok(new { mensaje = "Plantilla creada correctamente" });
            
            return BadRequest("Error al crear la plantilla");
        }

        // POST: api/PlantillasAcuerdo/procesar
        [HttpPost("procesar")]
        public async Task<IActionResult> PostProcesarPlantillas()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            var success = await _service.ProcessPlantillasAsync();

            if (success)
                return Ok(new { mensaje = "Plantillas procesadas correctamente" });
            
            return BadRequest("Error al procesar las plantillas o no hay plantillas pendientes");
        }

        // PUT: api/PlantillasAcuerdo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlantillaAcuerdo(int id, [FromBody] PlantillasAcuerdosDTO dto)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Methods", "PUT, OPTIONS");
            Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            
            if (dto == null) return BadRequest("Datos no válidos");

            var success = await _service.UpdatePlantillaAcuerdoAsync(id, dto);

            if (success)
                return Ok(new { mensaje = "Plantilla actualizada correctamente" });
            
            return NotFound($"No se ha encontrado la plantilla con ID {id}");
        }

        // DELETE: api/PlantillasAcuerdo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlantillaAcuerdo(int id)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Methods", "DELETE, OPTIONS");
            
            var success = await _service.DeletePlantillaAcuerdoAsync(id);

            if (success)
                return Ok(new { mensaje = "Plantilla eliminada correctamente" });
            
            return NotFound($"No se ha encontrado la plantilla con ID {id}");
        }
        
        // Manejador OPTIONS para Preflight
        [HttpOptions]
        [HttpOptions("{id}")]
        [HttpOptions("mutuas")]
        public IActionResult PreflightRoute()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            return Ok();
        }
    }
}
