using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using System.Data.Common;

namespace MZAsistencial.Server.Services
{
    public class DescuadresService : IDescuadresService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistrosActividadService _registrosService;

        public DescuadresService(MZAsistencialContext context, IRegistrosActividadService registrosService)
        {
            _context = context;
            _registrosService = registrosService;
        }

        public async Task<IEnumerable<DescuadreDTO>> RecalcularYObtenerDescuadresAsync(int usuarioId, int mutuaIdSesion, int anio)
        {
            // Registro de actividad único al inicio del proceso completo
            await _registrosService.InsertarRegistroActividad("PROCESS_START", usuarioId, $"Iniciando recálculo completo de descuadres para el año {anio}");

            // 1. Borrar todos los descuadres previos del usuario en un único bloque
            var existing = await _context.Descuadres.Where(d => d.UsuarioId == usuarioId).ToListAsync();

            
            if (existing.Count > 0)
            {
                _context.Descuadres.RemoveRange(existing);
                await _context.SaveChangesAsync();
            }

            // 2. Determinar mutuas a calcular
            var mutuas = mutuaIdSesion == 0
                ? await _context.Mutuas.Where(m => m.FechaBaja == null).OrderBy(m => m.MutuaId).ToListAsync()
                : await _context.Mutuas.Where(m => m.MutuaId == mutuaIdSesion && m.FechaBaja == null).ToListAsync();

            // Pre-cargar los totales de las 11 vistas agrupados por MutuaId antes de entrar al bucle (Evita N+1)
            var dictGp = await ObtenerTotalesVistaAgrupadaAsync("vw_Propios_Capitulo1", anio);
            var dictGc = await ObtenerTotalesVistaAgrupadaAsync("vw_Propios_Capitulo2", anio);
            var dictGf = await ObtenerTotalesVistaAgrupadaAsync("vw_Propios_Capitulo3", anio);
            var dictAm = await ObtenerTotalesVistaAgrupadaAsync("vw_Propios_Cuenta68", anio);

            var dictMa = await ObtenerTotalesVistaAgrupadaAsync("vw_Conciertos_Articulo25", anio);
            var dictA81 = await ObtenerTotalesVistaAgrupadaAsync("vw_Conciertos_Articulo258_1", anio);
            var dictA82 = await ObtenerTotalesVistaAgrupadaAsync("vw_Conciertos_Articulo258_2", anio);
            var dictR25 = await ObtenerTotalesVistaAgrupadaAsync("vw_Conciertos_Articulo25_Resto", anio);

            var dictInv = await ObtenerTotalesVistaAgrupadaAsync("vw_Propios_Articulo63", anio);
            var dictRep = await ObtenerTotalesVistaAgrupadaAsync("vw_Propios_Articulo62", anio);
            var dictOi = await ObtenerTotalesVistaAgrupadaAsync("vw_Propios_Articulo32", anio);

            var propValDict = await _context.VwPropiosValidados.GroupBy(v => v.MutuaId).Select(g => new { MutuaId = g.Key, Count = g.Count() }).ToDictionaryAsync(x => x.MutuaId, x => x.Count);
            var propNoValDict = await _context.VwPropiosNoValidados.GroupBy(v => v.MutuaId).Select(g => new { MutuaId = g.Key, Count = g.Count() }).ToDictionaryAsync(x => x.MutuaId, x => x.Count);
            var concValDict = await _context.VwConcertadosValidados.GroupBy(v => v.MutuaId).Select(g => new { MutuaId = g.Key, Count = g.Count() }).ToDictionaryAsync(x => x.MutuaId, x => x.Count);
            var concNoValDict = await _context.VwConcertadosNoValidados.GroupBy(v => v.MutuaId).Select(g => new { MutuaId = g.Key, Count = g.Count() }).ToDictionaryAsync(x => x.MutuaId, x => x.Count);

            var result = new List<DescuadreDTO>();

            // 3. Recalcular todo en memoria RAM 
            foreach (var m in mutuas)
            {
                int mId = m.MutuaId;

                decimal gp = dictGp.TryGetValue(mId, out var vGp) ? vGp : 0;
                decimal gc = dictGc.TryGetValue(mId, out var vGc) ? vGc : 0;
                decimal gf = dictGf.TryGetValue(mId, out var vGf) ? vGf : 0;
                decimal am = dictAm.TryGetValue(mId, out var vAm) ? vAm : 0;

                decimal ma = dictMa.TryGetValue(mId, out var vMa) ? vMa : 0;
                decimal a81 = dictA81.TryGetValue(mId, out var vA81) ? vA81 : 0;
                decimal a82 = dictA82.TryGetValue(mId, out var vA82) ? vA82 : 0;
                decimal r25 = dictR25.TryGetValue(mId, out var vR25) ? vR25 : 0;

                decimal inv = dictInv.TryGetValue(mId, out var vInv) ? vInv : 0;
                decimal rep = dictRep.TryGetValue(mId, out var vRep) ? vRep : 0;
                decimal oi = dictOi.TryGetValue(mId, out var vOi) ? vOi : 0;

                decimal totalCostePropios = gp + gc + gf + am;
                decimal totalArticulo25 = ma + a81 + a82 + r25;
                decimal totalOtrosConceptos = inv + rep + oi;
                decimal totalGeneral = totalCostePropios + totalArticulo25 + totalOtrosConceptos;

                int regPropVal = propValDict.TryGetValue(mId, out var c1) ? c1 : 0;
                int regPropNoVal = propNoValDict.TryGetValue(mId, out var c2) ? c2 : 0;
                int regConcVal = concValDict.TryGetValue(mId, out var c3) ? c3 : 0;
                int regConcNoVal = concNoValDict.TryGetValue(mId, out var c4) ? c4 : 0;

                var desc = new Descuadre
                {
                    UsuarioId = usuarioId,
                    MutuaId = mId,
                    GastoPersonal = gp,
                    GastoCorrientes = gc,
                    GastosFinancieros = gf,
                    Amortizacion = am,
                    MediosAjenos = ma,
                    Aplicacion2581 = a81,
                    Aplicacion2582 = a82,
                    Resto25 = r25,
                    InversionNueva = inv,
                    InversionReposicion = rep,
                    OtrosIngresos = oi,
                    RegPropiosValidados = regPropVal,
                    RegPropiosSinValidar = regPropNoVal,
                    RegConcertadosValidados = regConcVal,
                    RegConcertadosSinValidar = regConcNoVal
                };

                _context.Descuadres.Add(desc);

                result.Add(new DescuadreDTO
                {
                    MutuaId = mId,
                    Mutua = m.Mutua1,
                    GastoPersonal = gp,
                    GastoCorrientes = gc,
                    GastosFinancieros = gf,
                    Amortizacion = am,
                    TotalCostePropios = totalCostePropios,
                    CosteConciertos = ma,
                    Aplicacion2581 = a81,
                    Aplicacion2582 = a82,
                    RestoArt25 = r25,
                    TotalArticulo25 = totalArticulo25,
                    InversionNueva = inv,
                    Reposicion = rep,
                    IngresosServicios = oi,
                    TotalOtrosConceptos = totalOtrosConceptos,
                    TotalGeneral = totalGeneral,
                    PropiosConf = regPropVal,
                    PropiosNoConf = regPropNoVal,
                    ConcertConf = regConcVal,
                    ConcertNoConf = regConcNoVal
                });
            }

            // Un único SaveChangesAsync al final para impactar todo el lote de golpe 
            await _context.SaveChangesAsync();

            // Registro de actividad único al finalizar con éxito
            await _registrosService.InsertarRegistroActividad("PROCESS_END", usuarioId, $"Recálculo completo de descuadres finalizado con éxito para el año {anio}");

            return result;
        }

        private async Task<Dictionary<int, decimal>> ObtenerTotalesVistaAgrupadaAsync(string viewName, int anio)
        {
            var resultDict = new Dictionary<int, decimal>();
            try
            {
                var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                    await connection.OpenAsync();

                using var command = connection.CreateCommand();
                command.CommandText = $"SELECT MutuaId, SUM(Respuesta) FROM {viewName} WHERE Año = @anio GROUP BY MutuaId";

                var paramAnio = command.CreateParameter();
                paramAnio.ParameterName = "@anio";
                paramAnio.Value = anio;
                command.Parameters.Add(paramAnio);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    if (!reader.IsDBNull(0))
                    {
                        int mutuaId = reader.GetInt32(0);
                        decimal total = reader.IsDBNull(1) ? 0 : reader.GetDecimal(1);
                        resultDict[mutuaId] = total;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error crítico pre-calculando lote de la vista {viewName}: {ex.Message}");
            }
            return resultDict;
        }
        public async Task<bool> UpsertDescuadreAsync(int mutuaId, int usuarioId, DescuadreDTO dto)
        {
            var existing = await _context.Descuadres
                .FirstOrDefaultAsync(d => d.MutuaId == mutuaId && d.UsuarioId == usuarioId);

            if (existing == null)
            {
                _context.Descuadres.Add(new Descuadre
                {
                    UsuarioId = usuarioId,
                    MutuaId = mutuaId,
                    GastoPersonal = dto.GastoPersonal ?? 0,
                    GastoCorrientes = dto.GastoCorrientes ?? 0,
                    GastosFinancieros = dto.GastosFinancieros ?? 0,
                    Amortizacion = dto.Amortizacion ?? 0,
                    Aplicacion2581 = dto.Aplicacion2581 ?? 0,
                    Aplicacion2582 = dto.Aplicacion2582 ?? 0,
                    Resto25 = dto.RestoArt25 ?? 0,
                    InversionNueva = dto.InversionNueva ?? 0,
                    InversionReposicion = dto.Reposicion ?? 0,
                    OtrosIngresos = dto.IngresosServicios ?? 0,
                    MediosAjenos = dto.CosteConciertos ?? 0,
                    RegPropiosValidados = dto.PropiosConf ?? 0,
                    RegPropiosSinValidar = dto.PropiosNoConf ?? 0,
                    RegConcertadosValidados = dto.ConcertConf ?? 0,
                    RegConcertadosSinValidar = dto.ConcertNoConf ?? 0,
                });
            }
            else
            {
                existing.GastoPersonal = dto.GastoPersonal ?? existing.GastoPersonal;
                existing.GastoCorrientes = dto.GastoCorrientes ?? existing.GastoCorrientes;
                existing.GastosFinancieros = dto.GastosFinancieros ?? existing.GastosFinancieros;
                existing.Amortizacion = dto.Amortizacion ?? existing.Amortizacion;
                existing.Aplicacion2581 = dto.Aplicacion2581 ?? existing.Aplicacion2581;
                existing.Aplicacion2582 = dto.Aplicacion2582 ?? existing.Aplicacion2582;
                existing.Resto25 = dto.RestoArt25 ?? existing.Resto25;
                existing.InversionNueva = dto.InversionNueva ?? existing.InversionNueva;
                existing.InversionReposicion = dto.Reposicion ?? existing.InversionReposicion;
                existing.OtrosIngresos = dto.IngresosServicios ?? existing.OtrosIngresos;
                existing.MediosAjenos = dto.CosteConciertos ?? existing.MediosAjenos;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}