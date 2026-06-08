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

        public async Task<List<CentrosPropiosDTO>> GetAllAsync(int? perfilId = null)
        {
            var query = _context.CentrosPropios.AsQueryable();

            if (perfilId == null || (perfilId != 1 && perfilId != 4))
                query = query.Where(x => x.Desactivado != true);

            var centros = await query.ToListAsync();
            var mutuaIds = centros.Select(c => c.MutuaId).Distinct().ToList();
            var mutuas = await _context.Mutuas
                .Where(m => mutuaIds.Contains(m.MutuaId))
                .Select(m => new { m.MutuaId, m.Mutua1 })
                .ToListAsync();

            var poblacionIds = centros
                .Where(c => c.PoblacionId.HasValue)
                .Select(c => c.PoblacionId!.Value)
                .Distinct()
                .ToList();

            var poblaciones = await _context.AuxPoblaciones
                .Where(p => poblacionIds.Contains(p.PoblacionId))
                .Select(p => new { p.PoblacionId, Nombre = p.Poblacion, p.ProvinciaId })
                .ToListAsync();

            var provinciaIds = poblaciones.Select(p => p.ProvinciaId).Distinct().ToList();

            var provincias = await _context.AuxProvincias
                .Where(p => provinciaIds.Contains(p.ProvinciaId))
                .Select(p => new { p.ProvinciaId, Nombre = p.Provincia })
                .ToListAsync();

            return centros.Select(c =>
            {
                var pob  = c.PoblacionId.HasValue
                    ? poblaciones.FirstOrDefault(p => p.PoblacionId == c.PoblacionId.Value)
                    : null;
                var prov = pob != null
                    ? provincias.FirstOrDefault(p => p.ProvinciaId == pob.ProvinciaId)
                    : null;

                return new CentrosPropiosDTO
                {
                    Localizador            = c.Localizador,
                    CentroId               = c.CentroId,
                    MutuaId                = c.MutuaId,
                    NombreMutua            = mutuas.FirstOrDefault(m => m.MutuaId == c.MutuaId)?.Mutua1,
                    Centro                 = c.Centro,
                    Cp                     = c.Cp,
                    PoblacionId            = c.PoblacionId,
                    Poblacion              = pob?.Nombre,
                    Provincia              = prov?.Nombre,
                    ProvinciaId            = pob?.ProvinciaId,
                    Telefono               = c.Telefono,
                    Latitud                = c.Latitud,
                    Longitud               = c.Longitud,
                    CodigoMz               = c.CodigoMz,
                    Direccion              = c.Direccion,
                    Numero                 = c.Numero,
                    Piso                   = c.Piso,
                    Puerta                 = c.Puerta,
                    DireccionGoogle        = c.DireccionGis,
                    Email                  = c.DireccionElectronica,
                    PersonaContacto        = c.PersonaContacto,
                    OtrosDatos             = c.OtrosDatos,
                    ServiciosEspeciales    = c.ServiciosEspeciales,
                    Desactivado            = c.Desactivado,
                    FechaDesactivacion     = c.FechaDesactivacion,
                    UsuarioDesactivacion   = c.UsuarioDesactivacion,
                    Traslado               = c.Traslado,
                    MotivoBaja             = c.MotivoBaja,
                    FechaBaja              = c.FechaBaja,
                    AsistenciaHospitalaria = c.AsistenciaHospitalaria,
                    AsistenciaAmbulatoria  = c.AsistenciaAmbulatoria,
                    Rehabilitacion         = c.Rehabilitacion,
                    IncapacidadTransitoria = c.IncapacidadTransitoria,
                    Prevencion             = c.Prevencion,
                    Administracion         = c.Administracion,
                    OtrasActividades       = c.OtrasActividades,
                    Fautocom               = c.Fautocom,
                    Fpufuncio              = c.Fpufuncio,
                    Fcalisuf               = c.Fcalisuf,
                    TipoCentro             = c.TipoCentro,
                    MapaValidado           = c.MapaValidado,
                };
            }).ToList();
        }

        public async Task<CentrosPropiosDTO?> GetByIdAsync(int centroId)
        {
            var c = await _context.CentrosPropios
                .FirstOrDefaultAsync(x => x.CentroId == centroId);

            if (c is null) return null;

            var pob = c.PoblacionId.HasValue
                ? await _context.AuxPoblaciones
                    .Where(p => p.PoblacionId == c.PoblacionId.Value)
                    .Select(p => new { p.PoblacionId, Nombre = p.Poblacion, p.ProvinciaId })
                    .FirstOrDefaultAsync()
                : null;

            var prov = pob != null
                ? await _context.AuxProvincias
                    .Where(p => p.ProvinciaId == pob.ProvinciaId)
                    .Select(p => new { p.ProvinciaId, Nombre = p.Provincia })
                    .FirstOrDefaultAsync()
                : null;

            return new CentrosPropiosDTO
            {
                Localizador            = c.Localizador,
                CentroId               = c.CentroId,
                MutuaId                = c.MutuaId,
                Centro                 = c.Centro,
                Cp                     = c.Cp,
                PoblacionId            = c.PoblacionId,
                Poblacion              = pob?.Nombre,
                Provincia              = prov?.Nombre,
                ProvinciaId            = pob?.ProvinciaId,
                Telefono               = c.Telefono,
                Latitud                = c.Latitud,
                Longitud               = c.Longitud,
                CodigoMz               = c.CodigoMz,
                Direccion              = c.Direccion,
                Numero                 = c.Numero,
                Piso                   = c.Piso,
                Puerta                 = c.Puerta,
                DireccionGoogle        = c.DireccionGis,
                Email                  = c.DireccionElectronica,
                PersonaContacto        = c.PersonaContacto,
                OtrosDatos             = c.OtrosDatos,
                ServiciosEspeciales    = c.ServiciosEspeciales,
                Desactivado            = c.Desactivado,
                FechaDesactivacion     = c.FechaDesactivacion,
                UsuarioDesactivacion   = c.UsuarioDesactivacion,
                Traslado               = c.Traslado,
                MotivoBaja             = c.MotivoBaja,
                FechaBaja              = c.FechaBaja,
                AsistenciaHospitalaria = c.AsistenciaHospitalaria,
                AsistenciaAmbulatoria  = c.AsistenciaAmbulatoria,
                Rehabilitacion         = c.Rehabilitacion,
                IncapacidadTransitoria = c.IncapacidadTransitoria,
                Prevencion             = c.Prevencion,
                Administracion         = c.Administracion,
                OtrasActividades       = c.OtrasActividades,
                Fautocom               = c.Fautocom,
                Fpufuncio              = c.Fpufuncio,
                Fcalisuf               = c.Fcalisuf,
                TipoCentro             = c.TipoCentro,
                MapaValidado           = c.MapaValidado,
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
            centro.Desactivado = dto.Desactivado;
            if (dto.Desactivado == true && centro.FechaDesactivacion == null)
            {
                centro.FechaDesactivacion   = DateOnly.FromDateTime(DateTime.Now);
                centro.UsuarioDesactivacion = dto.UsuarioId;
            }
            else if (dto.Desactivado != true)
            {
                centro.FechaDesactivacion   = null;
                centro.UsuarioDesactivacion = null;
            }
            centro.Traslado             = dto.Traslado;
            centro.MotivoBaja           = dto.MotivoBaja;
            centro.FechaBaja            = dto.FechaBaja;
            centro.AsistenciaHospitalaria  = dto.AsistenciaHospitalaria;
            centro.AsistenciaAmbulatoria   = dto.AsistenciaAmbulatoria;
            centro.Rehabilitacion          = dto.Rehabilitacion;
            centro.IncapacidadTransitoria  = dto.IncapacidadTransitoria;
            centro.Prevencion              = dto.Prevencion;
            centro.Administracion          = dto.Administracion;
            centro.OtrasActividades        = dto.OtrasActividades;
            centro.Fautocom                = dto.Fautocom;
            centro.Fpufuncio               = dto.Fpufuncio;
            centro.Fcalisuf                = dto.Fcalisuf;
            centro.TipoCentro              = dto.TipoCentro;
            centro.FechaModificacion       = DateTime.Now;
            centro.MapaValidado            = dto.MapaValidado ?? centro.MapaValidado;

            await _context.SaveChangesAsync();

            await RegistrarActividadAsync(
                dto.UsuarioId,
                $"UPDATE CentroPropio {centroId} ({dto.Localizador})",
                $"UPDATE CentrosPropios SET Centro='{dto.Centro}', Localizador='{dto.Localizador}', FechaModificacion='{DateTime.Now}' WHERE Centro_id={centroId}"
            );

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

            await RegistrarActividadAsync(
                null,
                $"VALIDAR Centros [{string.Join(", ", ids)}]",
                $"UPDATE CentrosPropios SET Validado=1 WHERE Centro_id IN ({string.Join(", ", ids)})"
            );

            return true;
        }

        public async Task<bool> ExisteLocalizadorAsync(string localizador)
        {
            return await _context.CentrosPropios
                .AnyAsync(c => c.Localizador == localizador);
        }

        public async Task<string> GetSiguienteLocalizadorAsync(int mutuaId)
        {
            var mutua = await _context.Mutuas
                .FirstOrDefaultAsync(m => m.MutuaId == mutuaId);

            if (mutua is null) return "";

            var prefijo = mutua.NumeroMutua ?? $"M{mutuaId:D2}";

            var localizadores = await _context.CentrosPropios
                .Where(c => c.Localizador != null && c.Localizador.StartsWith(prefijo + "-"))
                .Select(c => c.Localizador)
                .ToListAsync();

            int siguiente = 1;
            if (localizadores.Any())
            {
                var numeros = localizadores
                    .Select(l => {
                        var partes = l!.Split('-');
                        return partes.Length > 1 && int.TryParse(partes[1], out int n) ? n : 0;
                    })
                    .Where(n => n > 0);

                if (numeros.Any())
                    siguiente = numeros.Max() + 1;
            }

            return $"{prefijo}-{siguiente:D2}";
        }

        private async Task RegistrarActividadAsync(int? usuarioId, string accion, string sql)
        {
            _context.RegistroActividads.Add(new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha     = DateTime.Now,
                Accion    = accion,
                Sql       = sql
            });
            await _context.SaveChangesAsync();
        }
    public async Task<bool> UpdateCoordenadasAsync(int id, string? latitud, string? longitud)
    {
        var centro = await _context.CentrosPropios.FindAsync(id);
        if (centro == null) return false;
        centro.Latitud   = latitud;
        centro.Longitud  = longitud;
        centro.MapaValidado = true;
        await _context.SaveChangesAsync();
        return true;
    }

    }
}
