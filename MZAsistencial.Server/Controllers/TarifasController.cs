using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TarifasController : ControllerBase
{
    private readonly ITarifasService _service;

    public TarifasController(ITarifasService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<TarifaListDTO>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TarifaFichaDTO>> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<TarifaFichaDTO>> Create([FromBody] TarifaFichaDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Descripcion) || string.IsNullOrWhiteSpace(dto.Año))
            return BadRequest(new { mensaje = "La descripción y el año son obligatorios." });

        var id = await _service.CreateAsync(dto);
        var created = await _service.GetByIdAsync(id);
        return Ok(created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TarifaFichaDTO dto)
    {
        if (id != dto.TarifaId && dto.TarifaId > 0)
            return BadRequest();

        if (string.IsNullOrWhiteSpace(dto.Descripcion) || string.IsNullOrWhiteSpace(dto.Año))
            return BadRequest(new { mensaje = "La descripción y el año son obligatorios." });

        dto.TarifaId = id;
        var ok = await _service.UpdateAsync(id, dto);
        if (!ok) return NotFound();

        var updated = await _service.GetByIdAsync(id);
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpGet("especialidades")]
    public async Task<ActionResult<List<AuxEspecialidadDTO>>> GetEspecialidades()
    {
        return Ok(await _service.GetEspecialidadesAsync());
    }

    [HttpGet("ciep/{especialidadId:int}")]
    public async Task<ActionResult<List<AuxCiepDTO>>> GetCiep(int especialidadId)
    {
        return Ok(await _service.GetCiepByEspecialidadAsync(especialidadId));
    }

    [HttpPost("copiar")]
    public async Task<ActionResult<TarifaFichaDTO>> Copiar([FromBody] CopiarTarifaRequestDTO request)
    {
        if (request.TarifaOrigenId <= 0 || string.IsNullOrWhiteSpace(request.NuevoAño))
            return BadRequest(new { mensaje = "Seleccione la tarifa origen y el año nuevo." });

        var copia = await _service.CopiarTarifaAsync(request);
        if (copia == null) return NotFound(new { mensaje = "No se encontró la tarifa origen." });

        return Ok(copia);
    }
}
