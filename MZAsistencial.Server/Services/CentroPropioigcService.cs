using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public class CentroPropioIcgService
    {
        private readonly MZAsistencialContext _context;

        public CentroPropioIcgService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<List<CentroPropioIcgDTO>> ObtenerCentrosIcg()
        {
            return await (from c in _context.CentrosPropios
                          join m in _context.Mutuas on c.MutuaId equals m.MutuaId into mg
                          from m in mg.DefaultIfEmpty()
                          select new CentroPropioIcgDTO
                          {
                              CentroId = c.CentroId,
                              Nombre = c.Centro,
                              Localizador = c.Localizador,
                              CodMutua = m != null ? m.NumeroMutua : null
                          }).ToListAsync();
        }
    }
}