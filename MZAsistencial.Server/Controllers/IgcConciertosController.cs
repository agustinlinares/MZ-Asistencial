using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IcgConciertosController : ControllerBase
    {
        private readonly IcgConciertosService _service;

        public IcgConciertosController(IcgConciertosService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IcgConciertoDto>>> Get()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }
    }
}