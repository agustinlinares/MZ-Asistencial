using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistroICGController : ControllerBase
    {
        private readonly RegistroICGService _service;

        public RegistroICGController(RegistroICGService service)
        {
            _service = service;
        }

        [HttpGet("{centroId:int}")]
        public async Task<ActionResult<List<RegistroICGDTO>>> GetByCentroId(int centroId)
        {
            var result = await _service.GetByCentroIdAsync(centroId);
            return Ok(result);
        }

        [HttpGet("Concertado/{centroId:int}")]
        public async Task<ActionResult<List<RegistroICGDTO>>> GetConcertadoByCentroId(int centroId)
        {
            var result = await _service.GetConcertadosByCentroIdAsync(centroId);
            return Ok(result);
        }
    }
}
