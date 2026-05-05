using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using System.Threading.Tasks;
using System.Linq;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuxDelegacionesController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public AuxDelegacionesController(MZAsistencialContext context)
        {
            _context = context;
        }

        [HttpGet("PorProveedor/{proveedorId}")]
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