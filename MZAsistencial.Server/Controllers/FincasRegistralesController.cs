using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FincasRegistralesController : ControllerBase
    {
        private readonly FincaRegistralService _fincaService;

        public FincasRegistralesController(FincaRegistralService fincaService)
        {
            _fincaService = fincaService;
        }

        [HttpGet]
        public async Task<ActionResult<List<FincaRegistralDTO>>> GetFincas()
        {
            var fincas = await _fincaService.ObtenerTodasLasFincas();
            return Ok(fincas);
        }
    }
}