using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using System.Collections.Generic;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FincasRegistralesController : ControllerBase
    {
        private readonly FincaRegistralService _service;

        public FincasRegistralesController(FincaRegistralService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<FincaRegistralDTO>>> Get([FromQuery] int? centroId)
        {
            // ✅ ObtenerTodasLasFincas no acepta parámetros — filtrar en memoria si se pasa centroId
            var todas = await _service.ObtenerTodasLasFincas();
            if (centroId.HasValue)
                todas = todas.Where(f => f.Centro_id == centroId.Value).ToList();
            return Ok(todas);
        }

        [HttpPost]
        public async Task<ActionResult<FincaRegistralDTO>> Create(FincaRegistralDTO fincaDto)
        {
            var result = await _service.CrearFinca(fincaDto);
            if (result == null)
                return BadRequest();
            return CreatedAtAction(nameof(Get), new { }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FincaRegistralDTO>> Update(int id, FincaRegistralDTO fincaDto)
        {
            var result = await _service.ActualizarFinca(id, fincaDto);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // ✅ EliminarFinca no existe en el Service — eliminamos directamente via contexto
            var finca = await _service.ObtenerFincaPorId(id);
            if (finca == null) return NotFound();
            // Marcar fecha de baja en lugar de eliminar físicamente
            finca.F_Baja = DateTime.Now;
            await _service.ActualizarFinca(id, finca);
            return Ok();
        }

        [HttpGet("{id}/costes")]
        public async Task<ActionResult<List<FincaCosteDTO>>> GetCostes(int id)
        {
            return Ok(await _service.ObtenerCostesFinca(id));
        }

        [HttpPost("{id}/costes")]
        public async Task<ActionResult<FincaCosteDTO>> CreateCoste(int id, FincaCosteDTO dto)
        {
            dto.FincaId = id;
            var result = await _service.CrearCoste(dto);
            return Ok(result);
        }

        [HttpPut("{id}/costes/{costeId}")]
        public async Task<ActionResult<FincaCosteDTO>> UpdateCoste(int id, int costeId, FincaCosteDTO dto)
        {
            dto.FincaId = id;
            var result = await _service.ActualizarCoste(costeId, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}/costes/{costeId}")]
        public async Task<IActionResult> DeleteCoste(int id, int costeId)
        {
            var ok = await _service.EliminarCoste(costeId);
            if (!ok) return NotFound();
            return Ok();
        }
    }
}
