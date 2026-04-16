using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuxInformesAcuerdosController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public AuxInformesAcuerdosController(MZAsistencialContext context)
        {
            _context = context;
        }

        // GET: api/auxinformesacuerdos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuxInformesAcuerdo>>> GetAuxInformesAcuerdos()
        {
            return await _context.AuxInformesAcuerdos.ToListAsync();
        }

        // GET: api/auxinformesacuerdos/T1
        [HttpGet("{id}")]
        public async Task<ActionResult<AuxInformesAcuerdo>> GetAuxInformeAcuerdo(string id)
        {
            var aux = await _context.AuxInformesAcuerdos
                .FirstOrDefaultAsync(a => a.TipoAcuerdoId == id);

            if (aux == null)
                return NotFound();

            return aux;
        }
    }
}