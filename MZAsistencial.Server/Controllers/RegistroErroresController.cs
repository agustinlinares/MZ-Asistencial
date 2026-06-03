using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using MZAsistencial.Server.Models;
using DevExtreme.AspNet.Data;

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

        [HttpGet]
        public async Task<IActionResult> GetRegistroErrores(DataSourceLoadOptions loadOptions)
        {
            var perfilId = User.FindFirst("perfilId")?.Value;
            if (perfilId != "1") return Forbid();

            var query = _registroErroresService.ObtenerListadoErroresQuery();
            return Ok(await DataSourceLoader.LoadAsync(query, loadOptions));
        }

        [HttpPut("{id}/estado")]
        public async Task<IActionResult> UpdateEstado(int id, [FromBody] int nuevoEstadoId)
        {
            var perfilId = User.FindFirst("perfilId")?.Value;
            if (perfilId != "1") return Forbid();

            var result = await _registroErroresService.UpdateEstadoAsync(id, nuevoEstadoId);
            if (!result) return NotFound();
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarError([FromBody] CrearRegistroErrorDTO dto)
        {
            var msg = $"{dto.Descripcion}";
            if (!string.IsNullOrWhiteSpace(dto.DetalleError))
            {
                msg += $"\n{dto.DetalleError}";
            }
            await _registroErroresService.LogErrorStringAsync(msg, dto.Modulo, dto.UsuarioId);
            return Ok();
        }
    }
}
