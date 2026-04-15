using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class CentrosPropiosService
    {
        private readonly MZAsistencialContext _context;

        public CentrosPropiosService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<List<CentrosPropiosDTO>> GetAllAsync()
        {
            return await _context.CentrosPropios
                .Select(c => new CentrosPropiosDTO
                {
                    Localizador = c.Localizador,
                    CentroId    = c.CentroId,
                    MutuaId     = c.MutuaId,
                    Centro      = c.Centro,
                    Cp          = c.Cp,
                    PoblacionId = c.PoblacionId,
                    Telefono    = c.Telefono,
                    Latitud     = c.Latitud,
                    Longitud    = c.Longitud,
                    CodigoMz    = c.CodigoMz,
                    Desactivado = c.Desactivado,
                })
                .ToListAsync();
        }

        public async Task<CentrosPropiosDTO?> GetByIdAsync(int centroId)
        {
            var c = await _context.CentrosPropios
                .FirstOrDefaultAsync(x => x.CentroId == centroId);

            if (c is null) return null;

            return new CentrosPropiosDTO
            {
                Localizador = c.Localizador,
                CentroId    = c.CentroId,
                MutuaId     = c.MutuaId,
                Centro      = c.Centro,
                Cp          = c.Cp,
                PoblacionId = c.PoblacionId,
                Telefono    = c.Telefono,
                Latitud     = c.Latitud,
                Longitud    = c.Longitud,
                CodigoMz    = c.CodigoMz,
                    Desactivado = c.Desactivado,
            };
        }
    }
}

