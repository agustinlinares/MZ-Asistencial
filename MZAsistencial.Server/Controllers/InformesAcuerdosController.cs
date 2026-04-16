using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InformesAcuerdosController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public InformesAcuerdosController(MZAsistencialContext context)
        {
            _context = context;
        }

        // GET: api/informesacuerdos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InformesAcuerdo>>> GetInformesAcuerdos()
        {
            return await _context.InformesAcuerdos.ToListAsync();
        }

        // GET: api/informesacuerdos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InformesAcuerdo>> GetInformeAcuerdo(int id)
        {
            var informe = await _context.InformesAcuerdos
                .FirstOrDefaultAsync(i => i.InformesId == id);

            if (informe == null)
                return NotFound();

            return informe;
        }

        // GET: api/informesacuerdos/mutua/5
        [HttpGet("mutua/{mutuaId}")]
        public async Task<ActionResult<IEnumerable<InformesAcuerdo>>> GetInformesPorMutua(int mutuaId)
        {
            return await _context.InformesAcuerdos
                .Where(i => i.MutuaId == mutuaId)
                .ToListAsync();
        }

        // GET: api/informesacuerdos/año/2024
        [HttpGet("año/{año}")]
        public async Task<ActionResult<IEnumerable<InformesAcuerdo>>> GetInformesPorAño(int año)
        {
            return await _context.InformesAcuerdos
                .Where(i => i.Año == año)
                .ToListAsync();
        }
    }
}