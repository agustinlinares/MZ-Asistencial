using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class FincaRegistralService
    {
        private readonly MZAsistencialContext _context;

        public FincaRegistralService(MZAsistencialContext context)
        {
            _context = context;
        }
        public async Task<(List<FincaRegistralDTO> Data, int Total)> ObtenerFincasPaginadas(int page, int pageSize, int? centroId)
        {
            var query = _context.FincasRegistrales.AsQueryable();

            if (centroId.HasValue)
                query = query.Where(f => f.CentroId == centroId.Value);

            var total = await query.CountAsync();

            var data = await (from f in query
                              join c in _context.CentrosPropios on f.CentroId equals c.CentroId into cg
                              from c in cg.DefaultIfEmpty()
                              orderby f.FincaId
                              select new FincaRegistralDTO
                              {
                                  Finca_id = f.FincaId,
                                  Centro_id = f.CentroId ?? 0,
                                  Localizador = f.Localizador,
                                  Mutua = null,
                                  Centro = c != null ? c.Centro : null,
                                  Direccion = f.NombreVia,
                                  Numero = f.Numero,
                                  Piso = f.Piso,
                                  Puerta = f.Puerta,
                                  CP = null,
                                  Provincia = null,
                                  Poblacion = null,
                                  Utilizacion = f.Utilizacion,
                                  Superficie = f.Superficie == null ? (decimal?)null : (decimal?)f.Superficie,
                                  Coste = f.Coste == null ? (decimal?)null : (decimal?)f.Coste,
                                  F_Alquiler = f.Fadqoarr,
                                  Referencia_Catastral = f.ReferenciaCatastral,
                                  F_Inscripcion = f.Finscreg,
                                  F_Baja = f.FechaBaja,
                                  Mapa = null,
                                  TipoFinca = f.TipoFinca,
                                  Titularidad = f.Titinmueble,
                                  OtrosDatos = f.OtrosDatos,
                                  DireccionGoogle = f.DireccionElectronica,
                                  Latitud = null,
                                  Longitud = null
                              }).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return (data, total);
        }

        public async Task<FincaRegistralDTO?> ObtenerFincaPorId(int id)
        {
            var f = await _context.FincasRegistrales
                .Where(x => x.FincaId == id)
                .Join(_context.CentrosPropios, fi => fi.CentroId, c => c.CentroId, (fi, c) => new { fi, c })
                .Select(x => new FincaRegistralDTO
                {
                    Finca_id = x.fi.FincaId,
                    Centro_id = x.fi.CentroId ?? 0,
                    Localizador = x.fi.Localizador,
                    Mutua = null,
                    Centro = x.c.Centro,
                    Direccion = x.fi.NombreVia,
                    Numero = x.fi.Numero,
                    Piso = x.fi.Piso,
                    Puerta = x.fi.Puerta,
                    CP = null,
                    Provincia = null,
                    Poblacion = null,
                    Utilizacion = x.fi.Utilizacion,
                    Superficie = x.fi.Superficie == null ? (decimal?)null : (decimal?)x.fi.Superficie,
                    Coste = x.fi.Coste == null ? (decimal?)null : (decimal?)x.fi.Coste,
                    F_Alquiler = x.fi.Fadqoarr,
                    Referencia_Catastral = x.fi.ReferenciaCatastral,
                    F_Inscripcion = x.fi.Finscreg,
                    F_Baja = x.fi.FechaBaja,
                    Mapa = null,
                    TipoFinca = x.fi.TipoFinca,
                    Titularidad = x.fi.Titinmueble,
                    OtrosDatos = x.fi.OtrosDatos,
                    DireccionGoogle = x.fi.DireccionElectronica,
                    Latitud = null,
                    Longitud = null
                }).FirstOrDefaultAsync();

            if (f != null)
                return f;

            // If no centro relation, try to fetch finca alone
            var fi = await _context.FincasRegistrales.FirstOrDefaultAsync(x => x.FincaId == id);
            if (fi == null) return null;

            return new FincaRegistralDTO
            {
                Finca_id = fi.FincaId,
                Centro_id = fi.CentroId ?? 0,
                Localizador = fi.Localizador,
                Mutua = null,
                Centro = null,
                Direccion = fi.NombreVia,
                Numero = fi.Numero,
                Piso = fi.Piso,
                Puerta = fi.Puerta,
                CP = null,
                Provincia = null,
                Poblacion = null,
                Utilizacion = fi.Utilizacion,
                Superficie = fi.Superficie == null ? (decimal?)null : (decimal?)fi.Superficie,
                Coste = fi.Coste == null ? (decimal?)null : (decimal?)fi.Coste,
                F_Alquiler = fi.Fadqoarr,
                Referencia_Catastral = fi.ReferenciaCatastral,
                F_Inscripcion = fi.Finscreg,
                F_Baja = fi.FechaBaja,
                Mapa = null,
                TipoFinca = fi.TipoFinca,
                Titularidad = fi.Titinmueble,
                OtrosDatos = fi.OtrosDatos,
                DireccionGoogle = fi.DireccionElectronica,
                Latitud = fi.Latitud,
                Longitud = fi.Longitud
            };
        }

        public async Task<FincaRegistralDTO?> ActualizarFinca(int id, FincaRegistralDTO dto)
        {
            var finca = await _context.FincasRegistrales.FirstOrDefaultAsync(f => f.FincaId == id);
            if (finca == null) return null;

            // prevent changing PK
            if (dto.Finca_id != 0 && dto.Finca_id != id)
                throw new ArgumentException("Finca id cannot be modified");

            finca.CentroId = dto.Centro_id != 0 ? dto.Centro_id : finca.CentroId;
            if (!string.IsNullOrEmpty(dto.Localizador))
                finca.Localizador = dto.Localizador;
            finca.NombreVia = dto.Direccion;
            finca.Numero = dto.Numero;
            finca.Piso = dto.Piso;
            finca.Puerta = dto.Puerta;
            finca.Superficie = dto.Superficie.HasValue ? (double?)dto.Superficie : null;
            finca.Coste = dto.Coste.HasValue ? (double?)dto.Coste : null;
            finca.Fadqoarr = dto.F_Alquiler;
            finca.Finscreg = dto.F_Inscripcion;
            finca.FechaBaja = dto.F_Baja;
            finca.ReferenciaCatastral = dto.Referencia_Catastral;
            finca.Utilizacion = dto.Utilizacion;
            finca.TipoFinca = dto.TipoFinca;
            finca.Titinmueble = dto.Titularidad;
            finca.OtrosDatos = dto.OtrosDatos;
            finca.DireccionElectronica = dto.DireccionGoogle;
            finca.Latitud = dto.Latitud;
            finca.Longitud = dto.Longitud;

            finca.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var updated = await ObtenerFincaPorId(id);
            return updated;
        }

        public async Task<FincaRegistralDTO?> CrearFinca(FincaRegistralDTO dto)
        {
            var finca = new FincasRegistrale
            {
                CentroId = dto.Centro_id != 0 ? dto.Centro_id : null,
                Localizador = dto.Localizador,
                NombreVia = dto.Direccion,
                Numero = dto.Numero,
                Piso = dto.Piso,
                Puerta = dto.Puerta,
                Superficie = dto.Superficie.HasValue ? (double?)dto.Superficie : null,
                Coste = dto.Coste.HasValue ? (double?)dto.Coste : null,
                Fadqoarr = dto.F_Alquiler,
                ReferenciaCatastral = dto.Referencia_Catastral,
                Finscreg = dto.F_Inscripcion,
                FechaBaja = dto.F_Baja,
                Utilizacion = dto.Utilizacion,
                TipoFinca = dto.TipoFinca,
                Titinmueble = dto.Titularidad,
                OtrosDatos = dto.OtrosDatos,
                DireccionElectronica = dto.DireccionGoogle,
                Latitud = dto.Latitud,
                Longitud = dto.Longitud,
                FechaAlta = DateTime.UtcNow,
                FechaModificacion = DateTime.UtcNow
            };

            _context.FincasRegistrales.Add(finca);
            await _context.SaveChangesAsync();

            var created = await ObtenerFincaPorId(finca.FincaId);
            return created;
        }

        public async Task<List<FincaCosteDTO>> ObtenerCostesFinca(int fincaId)
        {
            return await _context.FincasRegistralesCostesPorAños
                .Where(c => c.FincaId == fincaId)
                .Select(c => new FincaCosteDTO { Id = c.Id, FincaId = c.FincaId, Localizador = c.Localizador, Año = c.Año, Coste = c.Coste })
                .ToListAsync();
        }

        public async Task<FincaCosteDTO> CrearCoste(FincaCosteDTO dto)
        {
            var entity = new FincasRegistralesCostesPorAño
            {
                FincaId = dto.FincaId,
                Localizador = dto.Localizador,
                Año = dto.Año,
                Coste = dto.Coste
            };
            _context.FincasRegistralesCostesPorAños.Add(entity);
            await _context.SaveChangesAsync();
            dto.Id = entity.Id;
            return dto;
        }

        public async Task<FincaCosteDTO?> ActualizarCoste(int id, FincaCosteDTO dto)
        {
            var entity = await _context.FincasRegistralesCostesPorAños.FirstOrDefaultAsync(c => c.Id == id);
            if (entity == null) return null;
            entity.Localizador = dto.Localizador;
            entity.Año = dto.Año;
            entity.Coste = dto.Coste;
            await _context.SaveChangesAsync();
            dto.Id = id;
            return dto;
        }

        public async Task<bool> EliminarCoste(int id)
        {
            var entity = await _context.FincasRegistralesCostesPorAños.FirstOrDefaultAsync(c => c.Id == id);
            if (entity == null) return false;
            _context.FincasRegistralesCostesPorAños.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarFinca(int id)
        {
            var finca = await _context.FincasRegistrales.FirstOrDefaultAsync(f => f.FincaId == id);
            if (finca == null) return false;

            // Optional: Also delete related costs if needed, or check if they exist
            var costs = await _context.FincasRegistralesCostesPorAños.Where(c => c.FincaId == id).ToListAsync();
            if (costs.Any()) _context.FincasRegistralesCostesPorAños.RemoveRange(costs);

            _context.FincasRegistrales.Remove(finca);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<FincaRegistralDTO>> ObtenerTodasLasFincas(int? centroId = null)
        {
            var query = _context.FincasRegistrales.AsQueryable();
            if (centroId.HasValue)
                query = query.Where(f => f.CentroId == centroId.Value);

            return await (from f in query
                          join c in _context.CentrosPropios on f.CentroId equals c.CentroId into cg
                          from c in cg.DefaultIfEmpty()
                          orderby f.FincaId
                          select new FincaRegistralDTO
                          {
                              Finca_id = f.FincaId,
                              Centro_id = f.CentroId ?? 0,
                              Localizador = f.Localizador,
                              Mutua = null,
                              Centro = c != null ? c.Centro : null,
                              Direccion = f.NombreVia,
                              Numero = f.Numero,
                              Piso = f.Piso,
                              Puerta = f.Puerta,
                              CP = null,
                              Provincia = null,
                              Poblacion = null,
                              Utilizacion = f.Utilizacion,
                              Superficie = f.Superficie == null ? (decimal?)null : (decimal?)f.Superficie,
                              Coste = f.Coste == null ? (decimal?)null : (decimal?)f.Coste,
                              F_Alquiler = f.Fadqoarr,
                              Referencia_Catastral = f.ReferenciaCatastral,
                              F_Inscripcion = f.Finscreg,
                              F_Baja = f.FechaBaja,
                              Mapa = null,
                              TipoFinca = f.TipoFinca,
                              Titularidad = f.Titinmueble,
                              OtrosDatos = f.OtrosDatos,
                              DireccionGoogle = f.DireccionElectronica,
                              Latitud = null,
                              Longitud = null
                          }).ToListAsync();
        }
    }
}