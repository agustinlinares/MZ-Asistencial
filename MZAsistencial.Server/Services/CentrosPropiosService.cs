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
                    Direccion   = c.Direccion,
                    DireccionGoogle = c.DireccionGis,
                    Email       = c.DireccionElectronica,
                    PersonaContacto = c.PersonaContacto,
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
                Direccion   = c.Direccion,
                DireccionGoogle = c.DireccionGis,
                Email       = c.DireccionElectronica,
                PersonaContacto = c.PersonaContacto,
                Desactivado = c.Desactivado,
            };
        }

        public async Task<bool> UpdateAsync(int centroId, CentrosPropiosDTO dto)
        {
            var centro = await _context.CentrosPropios
                .FirstOrDefaultAsync(x => x.CentroId == centroId);

            if (centro is null) return false;

            centro.Centro               = dto.Centro;
            centro.Cp                   = dto.Cp;
            centro.Telefono             = dto.Telefono;
            centro.Latitud              = dto.Latitud;
            centro.Longitud             = dto.Longitud;
            centro.Direccion            = dto.Direccion;
            centro.DireccionGis         = dto.DireccionGoogle;
            centro.DireccionElectronica = dto.Email;
            centro.PersonaContacto      = dto.PersonaContacto;
            centro.Desactivado          = dto.Desactivado;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
