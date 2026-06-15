using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RegistroErroresController : ControllerBase
    {
        private readonly IRegistroErroresService _registroErroresService;

        public RegistroErroresController(IRegistroErroresService registroErroresService)
        {
            _registroErroresService = registroErroresService;
        }

        [AllowAnonymous]
        [HttpPost] 
        public async Task<IActionResult> Post([FromBody] CrearRegistroErrorDTO dto)
        {
            await _registroErroresService.RegistrarErrorCompletoAsync(dto);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetRegistroErrores(DataSourceLoadOptions loadOptions)
        {
            var perfilId = User.FindFirst("perfilId")?.Value ?? User.FindFirst("PerfilId")?.Value;
            if (perfilId != "1") return Forbid();

            var query = _registroErroresService.ObtenerListadoErroresQuery();
            return Ok(await DataSourceLoader.LoadAsync(query, loadOptions));
        }

        [HttpPut("{errorId}/estado")]
        public async Task<IActionResult> UpdateEstado(int errorId, [FromBody] int nuevoEstadoId)
        {
            var perfilId = User.FindFirst("perfilId")?.Value ?? User.FindFirst("PerfilId")?.Value;
            if (perfilId != "1") return Forbid();

            var success = await _registroErroresService.UpdateEstadoAsync(errorId, nuevoEstadoId);
            if (!success) return NotFound();
            
            return Ok();
        }
    }
}
