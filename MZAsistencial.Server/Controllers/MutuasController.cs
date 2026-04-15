using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MutuasController : ControllerBase
    {
        private readonly IMutuasService _service;

        public MutuasController(IMutuasService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetMutuas()
        {
            var mutuas = await _service.GetMutuasAsync();
            return Ok(mutuas);
        }
    }
}