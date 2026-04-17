using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public class MutuasService : IMutuasService
    {
        private readonly MZAsistencialContext _context;

        public MutuasService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MutuaDTO>> GetMutuasAsync()
        {
            return await _context.Mutuas
                .Select(m => new MutuaDTO
                {
                    Nº = m.MutuaId,
                    Mutua = m.Mutua1,
                    Direccion = m.Direccion,
                    CP = m.Cp,
                    Poblacion = m.PoblacionNavigation != null ? m.PoblacionNavigation.Poblacion : "",
                    Provincia = m.PoblacionNavigation != null && m.PoblacionNavigation.Provincia != null ? m.PoblacionNavigation.Provincia.Provincia : ""
                })
                .ToListAsync();
        }
    }
}