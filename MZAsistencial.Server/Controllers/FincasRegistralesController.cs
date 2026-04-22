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
        public async Task<ActionResult<List<FincaRegistralDTO>>> Get()
        {
            return Ok(await _service.ObtenerTodasLasFincas());
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