using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DescuadresController : ControllerBase
    {
        private readonly IDescuadresService _service;

        public DescuadresController(IDescuadresService service)
        {
            _service = service;
        }

        // GET: api/Descuadres
        [HttpGet]
        public async Task<IActionResult> GetDescuadres([FromQuery] int usuarioId, [FromQuery] int mutuaIdSesion, [FromQuery] int anio)
        {
            var descuadres = await _service.RecalcularYObtenerDescuadresAsync(usuarioId, mutuaIdSesion, anio);
            return Ok(descuadres);
        }

        // PUT: api/Descuadres/{mutuaId}
        [HttpPut("{mutuaId}")]
        public async Task<IActionResult> PutDescuadre(int mutuaId, [FromBody] DescuadreDTO dto)
        {
            var usuarioId = dto.UsuarioId ?? 0;
            if (usuarioId == 0)
                return BadRequest(new { error = "UsuarioId requerido" });

            var ok = await _service.UpsertDescuadreAsync(mutuaId, usuarioId, dto);
            if (!ok) return NotFound();
            return Ok(new { ok = true });
        }
    }
}
