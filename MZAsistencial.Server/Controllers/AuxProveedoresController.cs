using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using System.Threading.Tasks;
using System.Linq;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuxProveedoresController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public AuxProveedoresController(MZAsistencialContext context)
        {
            _context = context;
        }

        [HttpGet]
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
    }
}