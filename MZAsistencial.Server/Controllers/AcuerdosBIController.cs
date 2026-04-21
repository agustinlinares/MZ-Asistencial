using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AcuerdosBIController : ControllerBase
    {
        private readonly IAcuerdosBIService _service;

        public AcuerdosBIController(IAcuerdosBIService service)
        {
            _service = service;
        }

        [HttpGet("mutuas/oferta")]
        public async Task<IActionResult> GetMutuasOferta([FromQuery] int mutuaId, [FromQuery] int anio)
        {
            var data = await _service.GetMutuasOfertaAsync(mutuaId, anio);
            return Ok(data);
        }

        [HttpGet("mutuas/demanda")]
        public async Task<IActionResult> GetMutuasDemanda([FromQuery] int mutuaId, [FromQuery] int anio)
        {
            var data = await _service.GetMutuasDemandaAsync(mutuaId, anio);
            return Ok(data);
        }

        [HttpGet("provincias/oferta")]
        public async Task<IActionResult> GetProvinciasOferta([FromQuery] int mutuaId, [FromQuery] int anio)
        {
            var data = await _service.GetProvinciasOfertaAsync(mutuaId, anio);
            return Ok(data);
        }

        [HttpGet("provincias/demanda")]
        public async Task<IActionResult> GetProvinciasDemanda([FromQuery] int mutuaId, [FromQuery] int anio)
        {
            var data = await _service.GetProvinciasDemandaAsync(mutuaId, anio);
            return Ok(data);
        }

        [HttpGet("tiposervicio/oferta")]
        public async Task<IActionResult> GetTipoServicioOferta([FromQuery] int mutuaId, [FromQuery] int anio)
        {
            var data = await _service.GetTipoServicioOfertaAsync(mutuaId, anio);
            return Ok(data);
        }

        [HttpGet("tiposervicio/demanda")]
        public async Task<IActionResult> GetTipoServicioDemanda([FromQuery] int mutuaId, [FromQuery] int anio)
        {
            var data = await _service.GetTipoServicioDemandaAsync(mutuaId, anio);
            return Ok(data);
        }
    }
}