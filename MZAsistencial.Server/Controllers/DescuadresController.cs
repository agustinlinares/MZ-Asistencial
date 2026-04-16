using Microsoft.AspNetCore.Mvc;
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

        // GET: api/descuadres
        [HttpGet]
        public async Task<IActionResult> GetDescuadres()
        {
            var descuadres = await _service.GetDescuadresAsync();
            return Ok(descuadres);
        }
    }
}