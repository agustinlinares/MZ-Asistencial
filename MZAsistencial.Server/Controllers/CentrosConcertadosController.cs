using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CentrosConcertadosController : ControllerBase
    {
        private readonly CentrosConcertadosService _service;

        public CentrosConcertadosController(CentrosConcertadosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CentrosConcertadoDTO>>> Get()
        {
            var centros = await _service.GetCabecerasAsync();
            return Ok(centros);
        }
    }
}