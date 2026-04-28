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
        public async Task<ActionResult<List<CentrosPropiosDTO>>> GetAll()
        {
            var result = await _service.GetAllAsync();
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

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CentrosPropiosDTO dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (!result) return NotFound();
            return Ok();
        }

        [HttpPut("validar")]
        public async Task<IActionResult> Validar([FromBody] List<int> ids)
        {
            var result = await _service.ValidarAsync(ids);
            if (!result) return BadRequest();
            return Ok();
        }
    }
}