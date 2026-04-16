using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

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
    }
}