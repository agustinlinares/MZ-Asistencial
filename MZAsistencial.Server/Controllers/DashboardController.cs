using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _service;

        public DashboardController(DashboardService service)
        {
            _service = service;
        }

        /// <summary>
        /// Devuelve todos los datos del dashboard en una sola llamada:
        /// presupuesto y liquidación para los 3 bloques.
        /// GET /api/Dashboard?anio=2024&mutuaId=1
        /// mutuaId = 0 → todas las mutuas
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<DashboardDTO>> Get(
            [FromQuery] int? anio,
            [FromQuery] int? mutuaId)
        {
            var result = new DashboardDTO
            {
                CentrosPropios = new DashboardBloqueDTO
                {
                    Presupuesto = await _service.GetPresupuestoCentrosPropiosAsync(anio, mutuaId),
                    Liquidacion = await _service.GetLiquidacionCentrosPropiosAsync(anio, mutuaId),
                },
                Conciertos = new DashboardBloqueDTO
                {
                    Presupuesto = await _service.GetPresupuestoConciertosAsync(anio, mutuaId),
                    Liquidacion = await _service.GetLiquidacionConciertosAsync(anio, mutuaId),
                },
                OtrosConceptos = new DashboardBloqueDTO
                {
                    Presupuesto = await _service.GetPresupuestoOtrosConceptosAsync(anio, mutuaId),
                    Liquidacion = await _service.GetLiquidacionOtrosConceptosAsync(anio, mutuaId),
                },
            };

            return Ok(result);
        }
    }
}
