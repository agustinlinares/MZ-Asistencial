using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Services;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CentrosConcertadosController : ControllerBase
    {
        private readonly ICentrosConcertadosService _service;

        public CentrosConcertadosController(ICentrosConcertadosService service)
        {
            _service = service;
        }

        [HttpGet("cabeceras")]
        public async Task<ActionResult<IEnumerable<CentroConcertadoCabeceraDTO>>> GetCabeceras()
        {
            var cabeceras = await _service.GetCabecerasAsync();
            return Ok(cabeceras);
        }
    }
}