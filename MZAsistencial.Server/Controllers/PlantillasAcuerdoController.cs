using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Models;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantillasAcuerdoController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public PlantillasAcuerdoController(MZAsistencialContext context)
        {
            _context = context;
        }

        // GET: api/PlantillasAcuerdo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlantillasAcuerdosDTO>>> GetPlantillasAcuerdos()
        {
            var acuerdos = await _context.InformesAcuerdos
                .GroupJoin(_context.Mutuas,
                    ia => ia.MutuaId,
                    m => m.MutuaId,
                    (ia, mutuas) => new { ia, mutuas })
                .SelectMany(
                    x => x.mutuas.DefaultIfEmpty(),
                    (x, m) => new PlantillasAcuerdosDTO
                    {
                        Informe = x.ia.Informe,
                        EstadoInforme = x.ia.EstadoInformeId.ToString(),
                        TipoAcuerdo = x.ia.TipoAcuerdo,
                        Mutua = m != null ? m.Mutua1 : "Sin mutua",
                        Año = x.ia.Año,
                        Mes = x.ia.Mes,
                        Usuario = x.ia.UsuarioModificacion.ToString(),
                        FechaAlta = x.ia.FechaModificacion
                    })
                .ToListAsync();

            return Ok(acuerdos);
        }

        // POST: api/PlantillasAcuerdo
        [HttpPost]
        public async Task<IActionResult> PostPlantillaAcuerdo([FromBody] PlantillasAcuerdosDTO dto)
        {
            if (dto == null) return BadRequest("Los datos no son válidos");

            var nuevoAcuerdo = new InformesAcuerdo
            {
                Informe = dto.Informe ?? "Nuevo Acuerdo",
                EstadoInformeId = int.TryParse(dto.EstadoInforme, out int idEstado) ? idEstado : 1,
                TipoAcuerdo = dto.TipoAcuerdo ?? "Bilateral",
                MutuaId = 1,
                Año = dto.Año ?? DateTime.Now.Year,
                Mes = dto.Mes ?? DateTime.Now.Month,
                UsuarioModificacion = 123,
                FechaModificacion = DateTime.Now
            };

            _context.InformesAcuerdos.Add(nuevoAcuerdo);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Plantilla creada correctamente", acuerdo = nuevoAcuerdo });
        }

        // PUT: api/PlantillasAcuerdo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlantillaAcuerdo(int id, [FromBody] PlantillasAcuerdosDTO dto)
        {
            if (dto == null) return BadRequest("Datos no válidos");

            var acuerdo = await _context.InformesAcuerdos.FindAsync(id);

            if (acuerdo == null)
            {
                return NotFound($"No se ha encontrado la plantilla con ID {id}");
            }

            acuerdo.Informe = dto.Informe ?? acuerdo.Informe;
            
            if (int.TryParse(dto.EstadoInforme, out int nuevoEstadoId)) {
                acuerdo.EstadoInformeId = nuevoEstadoId;
            }

            acuerdo.TipoAcuerdo = dto.TipoAcuerdo ?? acuerdo.TipoAcuerdo;
            acuerdo.Año = dto.Año ?? acuerdo.Año;
            acuerdo.Mes = dto.Mes ?? acuerdo.Mes;
            
            acuerdo.UsuarioModificacion = 123;
            acuerdo.FechaModificacion = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Plantilla actualizada correctamente", acuerdo = acuerdo });
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Error de concurrencia al actualizar");
            }
        }

        // DELETE: api/PlantillasAcuerdo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlantillaAcuerdo(int id)
        {
            var acuerdo = await _context.InformesAcuerdos.FindAsync(id);
            
            if (acuerdo == null)
            {
                return NotFound($"No se ha encontrado la plantilla con ID {id}");
            }

            _context.InformesAcuerdos.Remove(acuerdo);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Plantilla eliminada correctamente" });
        }
    }
}
