using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuxCentrosConcertadosController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public AuxCentrosConcertadosController(MZAsistencialContext context)
        {
            _context = context;
        }

        [HttpGet("Provincias")]
        public async Task<IActionResult> GetProvincias()
        {
            // Usamos AsNoTracking porque solo vamos a leer datos, mejora el rendimiento.
            var provincias = await _context.AuxProvincias
                .AsNoTracking()
                .OrderBy(p => p.Provincia)
                .Select(p => new 
                { 
                    Id = p.ProvinciaId, 
                    Nombre = p.Provincia.Trim() 
                })
                .ToListAsync();

            return Ok(provincias);
        }

        [HttpGet("Poblaciones/{provinciaId}")]
        public async Task<IActionResult> GetPoblaciones(int provinciaId)
        {
            var poblaciones = await _context.AuxPoblaciones
                .AsNoTracking()
                .Where(p => p.ProvinciaId == provinciaId)
                .Select(p => new 
                { 
                    Id = p.PoblacionId, 
                    Nombre = p.Poblacion 
                })
                .ToListAsync();

            return Ok(poblaciones);
        }

        [HttpGet("Proveedores")]
        public async Task<IActionResult> GetProveedores()
        {
            var proveedores = await _context.Proveedores
                .AsNoTracking()
                .OrderBy(p => p.Proveedor)
                .Select(p => new 
                { 
                    Id = p.ProveedorId, 
                    Nombre = p.Proveedor 
                })
                .ToListAsync();

            return Ok(proveedores);
        }

        [HttpGet("Delegaciones/{proveedorId}")]
        public async Task<IActionResult> GetDelegaciones(int proveedorId)
        {
            var delegaciones = await _context.Delegaciones
                .AsNoTracking()
                .Where(d => d.ProveedorId == proveedorId)
                .Select(d => new 
                { 
                    Id = d.DelegacionId, 
                    Nombre = d.Delegacion 
                })
                .ToListAsync();

            return Ok(delegaciones);
        }
    }
}