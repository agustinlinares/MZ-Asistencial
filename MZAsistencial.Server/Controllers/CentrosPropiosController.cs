using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using Microsoft.AspNetCore.Mvc;
namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CentrosPropiosController : ControllerBase
    {
        private readonly CentrosPropiosService _service;
        public CentrosPropiosController(CentrosPropiosService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult<List<CentrosPropiosDTO>>> GetAll([FromQuery] int? perfilId, [FromQuery] int? mutuaId)
        {
            var result = await _service.GetAllAsync(perfilId, mutuaId);
            return Ok(result);
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CentrosPropiosDTO>> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result is null) return NotFound();
            return Ok(result);
        }
        [HttpGet("siguiente-localizador/{mutuaId:int}")]
        public async Task<ActionResult<string>> GetSiguienteLocalizador(int mutuaId)
        {
            var result = await _service.GetSiguienteLocalizadorAsync(mutuaId);
            return Ok(result);
        }
        [HttpGet("existe-localizador/{localizador}")]
        public async Task<ActionResult<bool>> ExisteLocalizador(string localizador)
        {
            var existe = await _service.ExisteLocalizadorAsync(localizador);
            return Ok(existe);
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CentrosPropiosDTO dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (!result) return NotFound();
            var updated = await _service.GetByIdAsync(id);
            return Ok(updated);
        }
        [HttpPut("validar")]
        public async Task<IActionResult> Validar([FromBody] List<int> ids)
        {
            var result = await _service.ValidarAsync(ids);
            if (!result) return BadRequest();
            return Ok();
        }
        [HttpPut("{id:int}/coordenadas")]
        public async Task<IActionResult> UpdateCoordenadas(int id, [FromBody] CoordenadasDto dto)
        {
            var result = await _service.UpdateCoordenadasAsync(id, dto.Latitud, dto.Longitud);
            if (!result) return NotFound();
            return Ok();
        }

    }
}
    public class CoordenadasDto
    {
        public string? Latitud  { get; set; }
        public string? Longitud { get; set; }
    }
