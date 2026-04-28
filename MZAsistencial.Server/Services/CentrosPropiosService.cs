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
                    Localizador     = c.Localizador,
                    CentroId        = c.CentroId,
                    MutuaId         = c.MutuaId,
                    Centro          = c.Centro,
                    Cp              = c.Cp,
                    PoblacionId     = c.PoblacionId,
                    Telefono        = c.Telefono,
                    Latitud         = c.Latitud,
                    Longitud        = c.Longitud,
                    CodigoMz        = c.CodigoMz,
                    Direccion       = c.Direccion,
                    Numero          = c.Numero,
                    Piso            = c.Piso,
                    Puerta          = c.Puerta,
                    DireccionGoogle = c.DireccionGis,
                    Email           = c.DireccionElectronica,
                    PersonaContacto = c.PersonaContacto,
                    OtrosDatos      = c.OtrosDatos,
                    ServiciosEspeciales     = c.ServiciosEspeciales,
                    Desactivado             = c.Desactivado,
                    Traslado                = c.Traslado,
                    MotivoBaja              = c.MotivoBaja,
                    FechaBaja               = c.FechaBaja,
                    AsistenciaHospitalaria  = c.AsistenciaHospitalaria,
                    AsistenciaAmbulatoria   = c.AsistenciaAmbulatoria,
                    Rehabilitacion          = c.Rehabilitacion,
                    IncapacidadTransitoria  = c.IncapacidadTransitoria,
                    Prevencion              = c.Prevencion,
                    Administracion          = c.Administracion,
                    OtrasActividades        = c.OtrasActividades,
                    Fautocom                = c.Fautocom,
                    Fpufuncio               = c.Fpufuncio,
                    Fcalisuf                = c.Fcalisuf,
                    TipoCentro              = c.TipoCentro,
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
                Localizador     = c.Localizador,
                CentroId        = c.CentroId,
                MutuaId         = c.MutuaId,
                Centro          = c.Centro,
                Cp              = c.Cp,
                PoblacionId     = c.PoblacionId,
                Telefono        = c.Telefono,
                Latitud         = c.Latitud,
                Longitud        = c.Longitud,
                CodigoMz        = c.CodigoMz,
                Direccion       = c.Direccion,
                Numero          = c.Numero,
                Piso            = c.Piso,
                Puerta          = c.Puerta,
                DireccionGoogle = c.DireccionGis,
                Email           = c.DireccionElectronica,
                PersonaContacto = c.PersonaContacto,
                OtrosDatos      = c.OtrosDatos,
                ServiciosEspeciales     = c.ServiciosEspeciales,
                Desactivado             = c.Desactivado,
                Traslado                = c.Traslado,
                MotivoBaja              = c.MotivoBaja,
                FechaBaja               = c.FechaBaja,
                AsistenciaHospitalaria  = c.AsistenciaHospitalaria,
                AsistenciaAmbulatoria   = c.AsistenciaAmbulatoria,
                Rehabilitacion          = c.Rehabilitacion,
                IncapacidadTransitoria  = c.IncapacidadTransitoria,
                Prevencion              = c.Prevencion,
                Administracion          = c.Administracion,
                OtrasActividades        = c.OtrasActividades,
                Fautocom                = c.Fautocom,
                Fpufuncio               = c.Fpufuncio,
                Fcalisuf                = c.Fcalisuf,
                TipoCentro              = c.TipoCentro,
            };
        }

        public async Task<bool> UpdateAsync(int centroId, CentrosPropiosDTO dto)
        {
            var centro = await _context.CentrosPropios
                .FirstOrDefaultAsync(x => x.CentroId == centroId);

            if (centro is null) return false;

            centro.MutuaId              = dto.MutuaId;
            centro.Centro               = dto.Centro;
            centro.Cp                   = dto.Cp;
            centro.Telefono             = dto.Telefono;
            centro.Latitud              = dto.Latitud;
            centro.Longitud             = dto.Longitud;
            centro.Direccion            = dto.Direccion;
            centro.Numero               = dto.Numero;
            centro.Piso                 = dto.Piso;
            centro.Puerta               = dto.Puerta;
            centro.DireccionGis         = dto.DireccionGoogle;
            centro.DireccionElectronica = dto.Email;
            centro.PersonaContacto      = dto.PersonaContacto;
            centro.OtrosDatos           = dto.OtrosDatos;
            centro.ServiciosEspeciales  = dto.ServiciosEspeciales;
            centro.Desactivado          = dto.Desactivado;
            centro.Traslado             = dto.Traslado;
            centro.MotivoBaja           = dto.MotivoBaja;
            centro.FechaBaja            = dto.FechaBaja;
            centro.AsistenciaHospitalaria  = (bool)(dto.AsistenciaHospitalaria ?? false);
            centro.AsistenciaAmbulatoria   = (bool)(dto.AsistenciaAmbulatoria ?? false);
            centro.Rehabilitacion          = (bool)(dto.Rehabilitacion ?? false);
            centro.IncapacidadTransitoria  = (bool)(dto.IncapacidadTransitoria ?? false);
            centro.Prevencion              = (bool)(dto.Prevencion ?? false);
            centro.Administracion          = (bool)(dto.Administracion ?? false);
            centro.OtrasActividades        = (bool)(dto.OtrasActividades ?? false);
            centro.Fautocom                = dto.Fautocom;
            centro.Fpufuncio               = dto.Fpufuncio;
            centro.Fcalisuf                = dto.Fcalisuf;
            centro.TipoCentro              = dto.TipoCentro;
            centro.FechaModificacion       = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ValidarAsync(List<int> ids)
        {
            var centros = await _context.CentrosPropios
                .Where(c => ids.Contains(c.CentroId))
                .ToListAsync();

            if (!centros.Any()) return false;

            foreach (var centro in centros)
            {
                centro.Validado = true;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
