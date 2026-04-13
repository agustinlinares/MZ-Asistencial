using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DescuadresController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public DescuadresController(MZAsistencialContext context)
        {
            _context = context;
        }

        // GET: api/descuadres
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Descuadre>>> GetDescuadres()
        {
            return await _context.Descuadres.ToListAsync();
        }

        // GET: api/descuadres/5
        [HttpGet("{mutuaId}")]
        public async Task<ActionResult<Descuadre>> GetDescuadre(int mutuaId)
        {
            var descuadre = await _context.Descuadres
                .FirstOrDefaultAsync(d => d.MutuaId == mutuaId);

            if (descuadre == null)
                return NotFound();

            return descuadre;
        }
    }
}