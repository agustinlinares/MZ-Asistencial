using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class FincaRegistralService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;
        private readonly IRegistrosActividadService _registroActividadService;

        public FincaRegistralService(MZAsistencialContext context, IRegistroErroresService registroErroresService, IRegistrosActividadService registroActividadService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
            _registroActividadService = registroActividadService;
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

        private string ConvertirTitularidad(string? cod)
        {
            if (string.IsNullOrEmpty(cod)) return "";
            return cod.Trim().ToUpper() switch
            {
                "PH" => "Patrimonio Histórico",
                "SS" => "Patrimonio de la Seguridad Social",
                "TT" => "Terceros distintos de los anteriores",
                _ => cod
            };
        }

        private string DesconvertirTitularidad(string? text)
        {
            if (string.IsNullOrEmpty(text)) return "";
            return text.Trim() switch
            {
                "Patrimonio Histórico" => "PH",
                "Patrimonio de la Seguridad Social" => "SS",
                "Terceros distintos de los anteriores" => "TT",
                _ => text
            };
        }

        private int? ObtenerMutuaId(System.Security.Claims.ClaimsPrincipal? user)
        {
            if (user == null) return null;
            var mutuaClaim = user.FindFirst("mutuaId");
            if (mutuaClaim != null && int.TryParse(mutuaClaim.Value, out int mutuaId)) return mutuaId;
            return null;
        }

        private int? ObtenerPerfilId(System.Security.Claims.ClaimsPrincipal? user)
        {
            if (user == null) return null;
            var perfilClaim = user.FindFirst("perfilId");
            if (perfilClaim != null && int.TryParse(perfilClaim.Value, out int perfilId)) return perfilId;
            return null;
        }

        private int? ObtenerUsuarioId(System.Security.Claims.ClaimsPrincipal? user)
        {
            if (user == null) return null;
            var subClaim = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier) ?? user.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            if (subClaim != null && int.TryParse(subClaim.Value, out int uId)) return uId;
            return null;
        }

        public async Task<(List<FincaRegistralDTO> Data, int Total)> ObtenerFincasPaginadas(int page, int pageSize, int? centroId, System.Security.Claims.ClaimsPrincipal? user = null)
        {
            var query = _context.FincasRegistrales.AsQueryable();
            if (centroId.HasValue)
                query = query.Where(f => f.CentroId == centroId.Value);

            var perfilId = ObtenerPerfilId(user);
            var mutuaId = ObtenerMutuaId(user);

            if (perfilId == 2 && mutuaId.HasValue)
            {
                query = query.Where(f => _context.CentrosPropios.Any(c => c.CentroId == f.CentroId && c.MutuaId == mutuaId.Value));
            }

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
                                   f.FechaAlta, f.FechaModificacion,
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
                Titularidad = ConvertirTitularidad(FixEncoding(x.Titinmueble)),
                OtrosDatos = FixEncoding(x.OtrosDatos),
                DireccionGoogle = x.DireccionElectronica,
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
                    x.fi.FechaAlta, x.fi.FechaModificacion,
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
                Titularidad = ConvertirTitularidad(FixEncoding(x.Titinmueble)),
                OtrosDatos = FixEncoding(x.OtrosDatos),
                DireccionGoogle = x.DireccionElectronica,
                CentroValidado = x.CentroValidado,
                FechaAlta = x.FechaAlta,
                FechaModificacion = x.FechaModificacion
            };
        }

        public async Task<FincaRegistralDTO?> ActualizarFinca(int id, FincaRegistralDTO dto, System.Security.Claims.ClaimsPrincipal? user = null)
        {
            try
            {
                var finca = await _context.FincasRegistrales.FirstOrDefaultAsync(f => f.FincaId == id);
                if (finca == null) return null;

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
                finca.Titinmueble = DesconvertirTitularidad(dto.Titularidad);
                finca.OtrosDatos = dto.OtrosDatos;
                finca.DireccionElectronica = dto.DireccionGoogle;

                var usuarioId = ObtenerUsuarioId(user);

                finca.FechaModificacion = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                if (usuarioId.HasValue)
                {
                    await _registroActividadService.InsertarRegistroActividad(
                        $"UPDATE FincasRegistrales SET NombreVia='{dto.Direccion}', Utilizacion='{finca.Utilizacion}', FechaModificacion='{finca.FechaModificacion}' WHERE Finca_id={id}",
                        usuarioId.Value,
                        $"UPDATE FincaRegistral {id} ({dto.Localizador})"
                    );
                }

                return await ObtenerFincaPorId(id);
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Fincas - ActualizarFinca");
                throw;
            }
        }

        public async Task<FincaRegistralDTO?> CrearFinca(FincaRegistralDTO dto, System.Security.Claims.ClaimsPrincipal? user = null)
        {
            try
            {
                var usuarioId = ObtenerUsuarioId(user);
                
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
                    Titinmueble = DesconvertirTitularidad(dto.Titularidad),
                    OtrosDatos = dto.OtrosDatos,
                    DireccionElectronica = dto.DireccionGoogle,
                    FechaAlta = DateTime.UtcNow,
                    UsuarioAltaId = usuarioId,
                    FechaModificacion = DateTime.UtcNow
                };

                _context.FincasRegistrales.Add(finca);
                await _context.SaveChangesAsync();

                if (usuarioId.HasValue)
                {
                    await _registroActividadService.InsertarRegistroActividad(
                        $"INSERT INTO FincasRegistrales (Localizador, NombreVia) VALUES ('{dto.Localizador}', '{dto.Direccion}')",
                        usuarioId.Value,
                        $"INSERT FincaRegistral {finca.FincaId} ({dto.Localizador})"
                    );
                }

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

        public async Task<bool> EliminarFinca(int id, System.Security.Claims.ClaimsPrincipal? user = null)
        {
            try
            {
                var finca = await _context.FincasRegistrales.FirstOrDefaultAsync(f => f.FincaId == id);
                if (finca == null) return false;

                // Eliminate associated costs first
                var costes = await _context.FincasRegistralesCostesPorAños.Where(c => c.FincaId == id).ToListAsync();
                if (costes.Any())
                {
                    _context.FincasRegistralesCostesPorAños.RemoveRange(costes);
                }

                _context.FincasRegistrales.Remove(finca);
                await _context.SaveChangesAsync();

                var usuarioId = ObtenerUsuarioId(user);
                if (usuarioId.HasValue)
                {
                    await _registroActividadService.InsertarRegistroActividad(
                        $"DELETE FROM FincasRegistrales WHERE Finca_id={id}",
                        usuarioId.Value,
                        $"DELETE FincaRegistral {id}"
                    );
                }

                return true;
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Fincas - EliminarFinca");
                throw;
            }
        }

        public async Task<List<FincaRegistralDTO>> ObtenerTodasLasFincas(int? centroId, int? anio, System.Security.Claims.ClaimsPrincipal? user = null)
        {
            var query = _context.FincasRegistrales.AsQueryable();
            if (centroId.HasValue)
                query = query.Where(f => f.CentroId == centroId.Value);

            var perfilId = ObtenerPerfilId(user);
            var mutuaId = ObtenerMutuaId(user);

            if (perfilId == 2 && mutuaId.HasValue)
            {
                query = query.Where(f => _context.CentrosPropios.Any(c => c.CentroId == f.CentroId && c.MutuaId == mutuaId.Value));
            }

            var fincas = await query.ToListAsync();
            var fincasIds = fincas.Select(f => f.FincaId).ToList();
            var centrosIds = fincas.Where(f => f.CentroId.HasValue).Select(f => f.CentroId!.Value).Distinct().ToList();

            var centros = await _context.CentrosPropios.Where(c => centrosIds.Contains(c.CentroId)).ToDictionaryAsync(c => c.CentroId, c => c);
            var costesQuery = _context.FincasRegistralesCostesPorAños.Where(c => fincasIds.Contains(c.FincaId));
            if (anio.HasValue)
            {
                costesQuery = costesQuery.Where(c => c.Anio == anio.Value);
            }
            var costes = await costesQuery.ToListAsync();
            var costesDict = costes.GroupBy(c => c.FincaId).ToDictionary(g => g.Key, g => g.FirstOrDefault());

            var rawList = fincas.Select(f => new 
                           { 
                               f.FincaId, f.CentroId, f.Localizador, f.NombreVia, f.Numero, f.Piso, f.Puerta,
                               f.Utilizacion, f.Superficie, 
                               CosteOriginal = f.Coste,
                               CosteAnual = costesDict.ContainsKey(f.FincaId) ? costesDict[f.FincaId]?.Coste : (double?)null,
                               f.Fadqoarr, f.ReferenciaCatastral,
                               f.Finscreg, f.FechaBaja, f.TipoFinca, f.Titinmueble, f.OtrosDatos, f.DireccionElectronica,
                               f.FechaAlta, f.FechaModificacion,
                               CentroNombre = f.CentroId.HasValue && centros.ContainsKey(f.CentroId.Value) ? centros[f.CentroId.Value].Centro : null,
                               CentroValidado = f.CentroId.HasValue && centros.ContainsKey(f.CentroId.Value) && centros[f.CentroId.Value].Validado == true
                           }).ToList();

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
                Titularidad = ConvertirTitularidad(FixEncoding(x.Titinmueble)),
                OtrosDatos = FixEncoding(x.OtrosDatos),
                DireccionGoogle = x.DireccionElectronica,
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