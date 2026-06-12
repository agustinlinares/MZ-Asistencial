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
            var perfilId = User.FindFirst("perfilId")?.Value ?? User.FindFirst("PerfilId")?.Value;
            var mutuaIdClaim = User.FindFirst("mutuaId")?.Value ?? User.FindFirst("MutuaId")?.Value;

            if (perfilId != "1" && perfilId != "2") return Forbid();

            int? mutuaId = null;
            if (perfilId == "2" && int.TryParse(mutuaIdClaim, out int parsedMutua))
            {
                mutuaId = parsedMutua;
            }

            var query = _registrosActividadService.ObtenerListadoRegistrosQuery(mutuaId);
            return Ok(await DataSourceLoader.LoadAsync(query, loadOptions));
        }

        [HttpGet("ultimo/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<RegistroActividad>>> GetUltimoRegistro(int usuarioId)
        {
            var perfilId = User.FindFirst("perfilId")?.Value ?? User.FindFirst("PerfilId")?.Value;
            var currentUserId = User.FindFirst("usuarioId")?.Value ?? User.FindFirst("UsuarioId")?.Value;
            
            if (perfilId != "1" && currentUserId != usuarioId.ToString()) 
                return Forbid();

            var registros = await _registrosActividadService.ObtenerUltimoRegistro(usuarioId);
            return Ok(registros);
        }
    }
}
