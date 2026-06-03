using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using System.Security.Claims;

namespace MZAsistencial.Server.Services
{
    public class FincaRegistralService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public FincaRegistralService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        private string FixEncoding(string? value)
        {
            if (string.IsNullOrEmpty(value)) return "";
            try
            {
                byte[] bytes = System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(value);
                return System.Text.Encoding.UTF8.GetString(bytes);
            }
            catch { return value ?? ""; }
        }

        public async Task<(List<FincaRegistralDTO> Data, int Total)> ObtenerFincasPaginadas(int page, int pageSize, int? centroId)
        {
            var query = _context.FincasRegistrales.AsQueryable();
            if (centroId.HasValue)
                query = query.Where(f => f.CentroId == centroId.Value);

            var total = await query.CountAsync();

            var rawData = await (from f in query
                               join c in _context.CentrosPropios on f.CentroId equals c.CentroId into cg
                               from c in cg.DefaultIfEmpty()
                               orderby f.FincaId
                               select new 
                               { 
                                   f.FincaId, f.CentroId, f.Localizador, f.NombreVia, f.Numero, f.Piso, f.Puerta,
                                   f.Utilizacion, f.Superficie, f.Coste, f.Fadqoarr, f.ReferenciaCatastral,
                                   f.Finscreg, f.FechaBaja, f.TipoFinca, f.Titinmueble, f.OtrosDatos, f.DireccionElectronica,
                                   f.Latitud, f.Longitud, f.FechaAlta, f.FechaModificacion,
                                   CentroNombre = c != null ? c.Centro : null,
                                   CentroValidado = c != null && c.Validado == true
                               })
                               .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            var data = rawData.Select(x => new FincaRegistralDTO
            {
                Finca_id = x.FincaId,
                Centro_id = x.CentroId ?? 0,
                Localizador = x.Localizador,
                Centro = x.CentroNombre,
                Direccion = FixEncoding((x.NombreVia ?? "")
                            + (x.Numero != null ? " " + x.Numero : "")
                            + (x.Piso != null ? ", " + x.Piso : "")
                            + (x.Puerta != null ? ", " + x.Puerta : "")),
                Utilizacion = FixEncoding(x.Utilizacion),
                Superficie = x.Superficie == null ? (decimal?)null : (decimal?)x.Superficie,
                Coste = x.Coste == null ? (decimal?)null : (decimal?)x.Coste,
                F_Alquiler = x.Fadqoarr,
                Referencia_Catastral = x.ReferenciaCatastral,
                F_Inscripcion = x.Finscreg,
                F_Baja = x.FechaBaja,
                TipoFinca = x.TipoFinca,
                Titularidad = FixEncoding(x.Titinmueble),
                OtrosDatos = FixEncoding(x.OtrosDatos),
                DireccionGoogle = x.DireccionElectronica,
                Latitud = x.Latitud,
                Longitud = x.Longitud,
                CentroValidado = x.CentroValidado,
                FechaAlta = x.FechaAlta,
                FechaModificacion = x.FechaModificacion
            }).ToList();

            return (data, total);
        }

        public async Task<FincaRegistralDTO?> ObtenerFincaPorId(int id)
        {
            var x = await _context.FincasRegistrales
                .Where(x => x.FincaId == id)
                .GroupJoin(_context.CentrosPropios, fi => fi.CentroId, c => c.CentroId, (fi, c) => new { fi, c })
                .SelectMany(x => x.c.DefaultIfEmpty(), (x, c) => new 
                { 
                    x.fi.FincaId, x.fi.CentroId, x.fi.Localizador, x.fi.NombreVia, x.fi.Numero, x.fi.Piso, x.fi.Puerta,
                    x.fi.Utilizacion, x.fi.Superficie, x.fi.Coste, x.fi.Fadqoarr, x.fi.ReferenciaCatastral,
                    x.fi.Finscreg, x.fi.FechaBaja, x.fi.TipoFinca, x.fi.Titinmueble, x.fi.OtrosDatos, x.fi.DireccionElectronica,
                    x.fi.Latitud, x.fi.Longitud, x.fi.FechaAlta, x.fi.FechaModificacion,
                    CentroNombre = c != null ? c.Centro : null,
                    CentroValidado = c != null && c.Validado == true
                })
                .FirstOrDefaultAsync();

            if (x == null) return null;

            return new FincaRegistralDTO
            {
                Finca_id = x.FincaId,
                Centro_id = x.CentroId ?? 0,
                Localizador = x.Localizador,
                Centro = x.CentroNombre,
                Direccion = FixEncoding((x.NombreVia ?? "")
                            + (x.Numero != null ? " " + x.Numero : "")
                            + (x.Piso != null ? ", " + x.Piso : "")
                            + (x.Puerta != null ? ", " + x.Puerta : "")),
                Utilizacion = FixEncoding(x.Utilizacion),
                Superficie = x.Superficie == null ? (decimal?)null : (decimal?)x.Superficie,
                Coste = x.Coste == null ? (decimal?)null : (decimal?)x.Coste,
                F_Alquiler = x.Fadqoarr,
                Referencia_Catastral = x.ReferenciaCatastral,
                F_Inscripcion = x.Finscreg,
                F_Baja = x.FechaBaja,
                TipoFinca = x.TipoFinca,
                Titularidad = FixEncoding(x.Titinmueble),
                OtrosDatos = FixEncoding(x.OtrosDatos),
                DireccionGoogle = x.DireccionElectronica,
                Latitud = x.Latitud,
                Longitud = x.Longitud,
                CentroValidado = x.CentroValidado,
                FechaAlta = x.FechaAlta,
                FechaModificacion = x.FechaModificacion
            };
        }

        public async Task<FincaRegistralDTO?> ActualizarFinca(int id, FincaRegistralDTO dto, ClaimsPrincipal user)
        {
            try
            {
                var finca = await _context.FincasRegistrales.FirstOrDefaultAsync(f => f.FincaId == id);
                if (finca == null) return null;

                var centro = finca.CentroId.HasValue ? await _context.CentrosPropios.FirstOrDefaultAsync(c => c.CentroId == finca.CentroId) : null;
                if (centro != null && centro.Validado == true)
                {
                    var perfilId = user?.FindFirst("perfilId")?.Value;
                    if (perfilId != "1")
                        throw new UnauthorizedAccessException("No tiene permisos para modificar una finca de un centro validado.");
                }

                finca.CentroId = dto.Centro_id != 0 ? dto.Centro_id : null;
                finca.Localizador = dto.Localizador;
                finca.NombreVia = dto.Direccion;
                finca.Superficie = dto.Superficie.HasValue ? (double?)dto.Superficie : null;
                finca.Coste = dto.Coste.HasValue ? (double?)dto.Coste : null;
                finca.Fadqoarr = dto.F_Alquiler;
                finca.Finscreg = dto.F_Inscripcion;
                finca.FechaBaja = dto.F_Baja;
                finca.ReferenciaCatastral = dto.Referencia_Catastral;
                finca.Utilizacion = string.IsNullOrEmpty(dto.Utilizacion) ? InferUtilizacion(dto.TipoFinca) : dto.Utilizacion;
                finca.TipoFinca = dto.TipoFinca;
                finca.Titinmueble = dto.Titularidad;
                finca.OtrosDatos = dto.OtrosDatos;
                finca.DireccionElectronica = dto.DireccionGoogle;
                finca.Latitud = dto.Latitud;
                finca.Longitud = dto.Longitud;

                finca.FechaModificacion = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return await ObtenerFincaPorId(id);
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Fincas - ActualizarFinca");
                throw;
            }
        }

        public async Task<FincaRegistralDTO?> CrearFinca(FincaRegistralDTO dto)
        {
            try
            {
                var finca = new FincasRegistrale
                {
                    CentroId = dto.Centro_id != 0 ? dto.Centro_id : null,
                    Localizador = dto.Localizador,
                    NombreVia = dto.Direccion,
                    Superficie = dto.Superficie.HasValue ? (double?)dto.Superficie : null,
                    Coste = dto.Coste.HasValue ? (double?)dto.Coste : null,
                    Fadqoarr = dto.F_Alquiler,
                    ReferenciaCatastral = dto.Referencia_Catastral,
                    Finscreg = dto.F_Inscripcion,
                    FechaBaja = dto.F_Baja,
                    Utilizacion = string.IsNullOrEmpty(dto.Utilizacion) ? InferUtilizacion(dto.TipoFinca) : dto.Utilizacion,
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

                return await ObtenerFincaPorId(finca.FincaId);
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Fincas - CrearFinca");
                throw;
            }
        }

        public async Task<List<FincaCosteDTO>> ObtenerCostesFinca(int fincaId)
        {
            return await _context.FincasRegistralesCostesPorAños
                .Where(c => c.FincaId == fincaId)
                .Select(c => new FincaCosteDTO { Id = c.Id, FincaId = c.FincaId, Localizador = c.Localizador, Anio = c.Anio, Coste = c.Coste })
                .ToListAsync();
        }

        public async Task<FincaCosteDTO> CrearCoste(FincaCosteDTO dto)
        {
            try
            {
                var entity = new FincasRegistralesCostesPorAño
                {
                    FincaId = dto.FincaId,
                    Localizador = dto.Localizador,
                    Anio = dto.Anio,
                    Coste = dto.Coste
                };
                _context.FincasRegistralesCostesPorAños.Add(entity);
                await _context.SaveChangesAsync();
                dto.Id = entity.Id;
                return dto;
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Fincas - CrearCoste");
                throw;
            }
        }

        public async Task<FincaCosteDTO?> ActualizarCoste(int id, FincaCosteDTO dto)
        {
            try
            {
                var entity = await _context.FincasRegistralesCostesPorAños.FirstOrDefaultAsync(c => c.Id == id);
                if (entity == null) return null;
                entity.Localizador = dto.Localizador;
                entity.Anio = dto.Anio;
                entity.Coste = dto.Coste;
                await _context.SaveChangesAsync();
                dto.Id = id;
                return dto;
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Fincas - ActualizarCoste");
                throw;
            }
        }

        public async Task<bool> EliminarCoste(int id)
        {
            try
            {
                var entity = await _context.FincasRegistralesCostesPorAños.FirstOrDefaultAsync(c => c.Id == id);
                if (entity == null) return false;
                _context.FincasRegistralesCostesPorAños.Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Fincas - EliminarCoste");
                throw;
            }
        }

        public async Task<bool> EliminarFinca(int id, ClaimsPrincipal user)
        {
            try
            {
                var finca = await _context.FincasRegistrales.FirstOrDefaultAsync(f => f.FincaId == id);
                if (finca == null) return false;

                var centro = finca.CentroId.HasValue ? await _context.CentrosPropios.FirstOrDefaultAsync(c => c.CentroId == finca.CentroId) : null;
                if (centro != null && centro.Validado == true)
                {
                    var perfilId = user?.FindFirst("perfilId")?.Value;
                    if (perfilId != "1")
                        throw new UnauthorizedAccessException("No tiene permisos para eliminar una finca de un centro validado.");
                }

                _context.FincasRegistrales.Remove(finca);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Fincas - EliminarFinca");
                throw;
            }
        }

        public async Task<List<FincaRegistralDTO>> ObtenerTodasLasFincas(int? centroId, int? anio)
        {
            var query = _context.FincasRegistrales.AsQueryable();
            if (centroId.HasValue)
                query = query.Where(f => f.CentroId == centroId.Value);

            var rawList = await (from f in query
                           join c in _context.CentrosPropios on f.CentroId equals c.CentroId into cg
                           from c in cg.DefaultIfEmpty()
                           join cost in _context.FincasRegistralesCostesPorAños.Where(x => anio == null || x.Anio == anio) on f.FincaId equals cost.FincaId into costg
                           from cost in costg.DefaultIfEmpty()
                           orderby f.FincaId
                           select new 
                           { 
                               f.FincaId, f.CentroId, f.Localizador, f.NombreVia, f.Numero, f.Piso, f.Puerta,
                               f.Utilizacion, f.Superficie, 
                               CosteOriginal = f.Coste,
                               CosteAnual = cost != null ? cost.Coste : (double?)null,
                               f.Fadqoarr, f.ReferenciaCatastral,
                               f.Finscreg, f.FechaBaja, f.TipoFinca, f.Titinmueble, f.OtrosDatos, f.DireccionElectronica,
                               f.Latitud, f.Longitud, f.FechaAlta, f.FechaModificacion,
                               CentroNombre = c != null ? c.Centro : null,
                               CentroValidado = c != null && c.Validado == true
                           }).ToListAsync();

            return rawList.Select(x => new FincaRegistralDTO
            {
                Finca_id = x.FincaId,
                Centro_id = x.CentroId ?? 0,
                Localizador = x.Localizador,
                Centro = x.CentroNombre,
                Direccion = FixEncoding((x.NombreVia ?? "")
                            + (x.Numero != null ? " " + x.Numero : "")
                            + (x.Piso != null ? ", " + x.Piso : "")
                            + (x.Puerta != null ? ", " + x.Puerta : "")),
                Utilizacion = FixEncoding(x.Utilizacion),
                Superficie = x.Superficie == null ? (decimal?)null : (decimal?)x.Superficie,
                Coste = (decimal?)(anio.HasValue ? x.CosteAnual : x.CosteOriginal),
                F_Alquiler = x.Fadqoarr,
                Referencia_Catastral = x.ReferenciaCatastral,
                F_Inscripcion = x.Finscreg,
                F_Baja = x.FechaBaja,
                TipoFinca = x.TipoFinca,
                Titularidad = FixEncoding(x.Titinmueble),
                OtrosDatos = FixEncoding(x.OtrosDatos),
                DireccionGoogle = x.DireccionElectronica,
                Latitud = x.Latitud,
                Longitud = x.Longitud,
                CentroValidado = x.CentroValidado,
                FechaAlta = x.FechaAlta,
                FechaModificacion = x.FechaModificacion
            }).ToList();
        }

        private string? InferUtilizacion(int? tipoFinca)
        {
            return tipoFinca switch
            {
                0 => "Sotano tecnico",
                1 => "Local asistencial",
                2 => "Piso / Oficinas",
                3 => "Local asistencial",
                4 => "Garaje / Aparcamiento",
                5 => "Trastero / Almacen",
                _ => null
            };
        }
    }
}