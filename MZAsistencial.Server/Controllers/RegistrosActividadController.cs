using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using MZAsistencial.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

using DevExtreme.AspNet.Data;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RegistrosActividadController : ControllerBase
    {
        private readonly IRegistrosActividadService _registrosActividadService;

        public RegistrosActividadController(IRegistrosActividadService registrosActividadService)
        {
            _registrosActividadService = registrosActividadService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRegistrosActividad(DataSourceLoadOptions loadOptions)
        {
            var perfilId = User.FindFirst("perfilId")?.Value;
            if (perfilId != "1") return Forbid();

            var query = _registrosActividadService.ObtenerListadoRegistrosQuery();
            return Ok(await DataSourceLoader.LoadAsync(query, loadOptions));
        }

        [HttpGet("ultimo/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<RegistroActividad>>> GetUltimoRegistro(int usuarioId)
        {
            var perfilId = User.FindFirst("perfilId")?.Value;
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (perfilId != "1" && currentUserId != usuarioId.ToString()) 
                return Forbid();

            var registros = await _registrosActividadService.ObtenerUltimoRegistro(usuarioId);
            return Ok(registros);
        }
    }
}
