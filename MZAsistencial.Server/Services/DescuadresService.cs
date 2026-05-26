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
            // 1. Borrar todos los descuadres del usuario
            var existing = await _context.Descuadres.Where(d => d.UsuarioId == usuarioId).ToListAsync();
            if (existing.Any())
            {
                _context.Descuadres.RemoveRange(existing);
                await _context.SaveChangesAsync();
            }
            await _registrosService.InsertarRegistroActividad("DELETE", usuarioId, "Eliminar descuadres previos para recálculo");

            // 2. Determinar mutuas a calcular
            var mutuas = mutuaIdSesion == 0
                ? await _context.Mutuas.Where(m => m.FechaBaja == null).OrderBy(m => m.MutuaId).ToListAsync()
                : await _context.Mutuas.Where(m => m.MutuaId == mutuaIdSesion && m.FechaBaja == null).ToListAsync();

            var result = new List<DescuadreDTO>();

            // 3. Recalcular
            foreach (var m in mutuas)
            {
                decimal gp  = await CalcularDiferenciasDescuadres("vw_Propios_Capitulo1", m.MutuaId, anio);
                decimal gc  = await CalcularDiferenciasDescuadres("vw_Propios_Capitulo2", m.MutuaId, anio);
                decimal gf  = await CalcularDiferenciasDescuadres("vw_Propios_Capitulo3", m.MutuaId, anio);
                decimal am  = await CalcularDiferenciasDescuadres("vw_Propios_Cuenta68", m.MutuaId, anio);
                
                decimal ma  = await CalcularDiferenciasDescuadres("vw_Conciertos_Articulo25", m.MutuaId, anio);
                decimal a81 = await CalcularDiferenciasDescuadres("vw_Conciertos_Articulo258_1", m.MutuaId, anio);
                decimal a82 = await CalcularDiferenciasDescuadres("vw_Conciertos_Articulo258_2", m.MutuaId, anio);
                decimal r25 = await CalcularDiferenciasDescuadres("vw_Conciertos_Articulo25_Resto", m.MutuaId, anio);
                
                decimal inv = await CalcularDiferenciasDescuadres("vw_Propios_Articulo63", m.MutuaId, anio);
                decimal rep = await CalcularDiferenciasDescuadres("vw_Propios_Articulo62", m.MutuaId, anio);
                decimal oi  = await CalcularDiferenciasDescuadres("vw_Propios_Articulo32", m.MutuaId, anio);

                decimal totalCostePropios = gp + gc + gf + am;
                decimal totalArticulo25 = ma + a81 + a82 + r25;
                decimal totalOtrosConceptos = inv + rep + oi;
                decimal totalGeneral = totalCostePropios + totalArticulo25 + totalOtrosConceptos;

                var desc = new Descuadre
                {
                    UsuarioId = usuarioId,
                    MutuaId = m.MutuaId,
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
                    RegPropiosValidados = 0,
                    RegPropiosSinValidar = 0,
                    RegConcertadosValidados = 0,
                    RegConcertadosSinValidar = 0
                };

                _context.Descuadres.Add(desc);
                await _context.SaveChangesAsync();
                await _registrosService.InsertarRegistroActividad("INSERT", usuarioId, $"Insertado cálculo descuadre Mutua {m.MutuaId}");

                // 4. Actualizar Contadores
                await ActualizarDescuadresUsuario(usuarioId, m.MutuaId);

                // Reload from DB to get the updated counters
                var finalDesc = await _context.Descuadres.FirstOrDefaultAsync(d => d.UsuarioId == usuarioId && d.MutuaId == m.MutuaId);
                
                result.Add(new DescuadreDTO
                {
                    MutuaId = m.MutuaId,
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
                    PropiosConf = finalDesc?.RegPropiosValidados ?? 0,
                    PropiosNoConf = finalDesc?.RegPropiosSinValidar ?? 0,
                    ConcertConf = finalDesc?.RegConcertadosValidados ?? 0,
                    ConcertNoConf = finalDesc?.RegConcertadosSinValidar ?? 0
                });
            }

            return result;
        }

        private async Task<decimal> CalcularDiferenciasDescuadres(string viewName, int mutuaId, int anio)
        {
            try
            {
                // Usamos ADO.NET para llamar la vista dinámicamente
                var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                    await connection.OpenAsync();

                using var command = connection.CreateCommand();
                command.CommandText = $"SELECT SUM(Respuesta) FROM {viewName} WHERE MutuaId = @mutuaId AND Año = @anio";
                
                var paramMutua = command.CreateParameter();
                paramMutua.ParameterName = "@mutuaId";
                paramMutua.Value = mutuaId;
                command.Parameters.Add(paramMutua);

                var paramAnio = command.CreateParameter();
                paramAnio.ParameterName = "@anio";
                paramAnio.Value = anio;
                command.Parameters.Add(paramAnio);

                var result = await command.ExecuteScalarAsync();
                
                if (result != null && result != DBNull.Value)
                {
                    return Convert.ToDecimal(result);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calculando {viewName}: {ex.Message}");
            }
            
            return 0;
        }

        private async Task ActualizarDescuadresUsuario(int usuarioId, int mutuaId)
        {
            var desc = await _context.Descuadres.FirstOrDefaultAsync(d => d.UsuarioId == usuarioId && d.MutuaId == mutuaId);
            if (desc == null) return;

            int regPropVal = await _context.VwPropiosValidados.CountAsync(v => v.MutuaId == mutuaId);
            desc.RegPropiosValidados = regPropVal;
            await _context.SaveChangesAsync();
            await _registrosService.InsertarRegistroActividad("UPDATE", usuarioId, $"Actualizado RegPropiosValidados Mutua {mutuaId}");

            int regPropNoVal = await _context.VwPropiosNoValidados.CountAsync(v => v.MutuaId == mutuaId);
            desc.RegPropiosSinValidar = regPropNoVal;
            await _context.SaveChangesAsync();
            await _registrosService.InsertarRegistroActividad("UPDATE", usuarioId, $"Actualizado RegPropiosSinValidar Mutua {mutuaId}");

            int regConcVal = await _context.VwConcertadosValidados.CountAsync(v => v.MutuaId == mutuaId);
            desc.RegConcertadosValidados = regConcVal;
            await _context.SaveChangesAsync();
            await _registrosService.InsertarRegistroActividad("UPDATE", usuarioId, $"Actualizado RegConcertadosValidados Mutua {mutuaId}");

            int regConcNoVal = await _context.VwConcertadosNoValidados.CountAsync(v => v.MutuaId == mutuaId);
            desc.RegConcertadosSinValidar = regConcNoVal;
            await _context.SaveChangesAsync();
            await _registrosService.InsertarRegistroActividad("UPDATE", usuarioId, $"Actualizado RegConcertadosSinValidar Mutua {mutuaId}");
        }

        public async Task<bool> UpsertDescuadreAsync(int mutuaId, int usuarioId, DescuadreDTO dto)
        {
            var existing = await _context.Descuadres
                .FirstOrDefaultAsync(d => d.MutuaId == mutuaId && d.UsuarioId == usuarioId);

            if (existing == null)
            {
                _context.Descuadres.Add(new Descuadre
                {
                    UsuarioId           = usuarioId,
                    MutuaId             = mutuaId,
                    GastoPersonal       = dto.GastoPersonal       ?? 0,
                    GastoCorrientes     = dto.GastoCorrientes     ?? 0,
                    GastosFinancieros   = dto.GastosFinancieros   ?? 0,
                    Amortizacion        = dto.Amortizacion        ?? 0,
                    Aplicacion2581      = dto.Aplicacion2581      ?? 0,
                    Aplicacion2582      = dto.Aplicacion2582      ?? 0,
                    Resto25             = dto.RestoArt25          ?? 0,
                    InversionNueva      = dto.InversionNueva      ?? 0,
                    InversionReposicion = dto.Reposicion          ?? 0,
                    OtrosIngresos       = dto.IngresosServicios   ?? 0,
                    MediosAjenos        = dto.CosteConciertos     ?? 0,
                    RegPropiosValidados      = dto.PropiosConf    ?? 0,
                    RegPropiosSinValidar     = dto.PropiosNoConf  ?? 0,
                    RegConcertadosValidados  = dto.ConcertConf    ?? 0,
                    RegConcertadosSinValidar = dto.ConcertNoConf  ?? 0,
                });
            }
            else
            {
                existing.GastoPersonal       = dto.GastoPersonal       ?? existing.GastoPersonal;
                existing.GastoCorrientes     = dto.GastoCorrientes     ?? existing.GastoCorrientes;
                existing.GastosFinancieros   = dto.GastosFinancieros   ?? existing.GastosFinancieros;
                existing.Amortizacion        = dto.Amortizacion        ?? existing.Amortizacion;
                existing.Aplicacion2581      = dto.Aplicacion2581      ?? existing.Aplicacion2581;
                existing.Aplicacion2582      = dto.Aplicacion2582      ?? existing.Aplicacion2582;
                existing.Resto25             = dto.RestoArt25          ?? existing.Resto25;
                existing.InversionNueva      = dto.InversionNueva      ?? existing.InversionNueva;
                existing.InversionReposicion = dto.Reposicion          ?? existing.InversionReposicion;
                existing.OtrosIngresos       = dto.IngresosServicios   ?? existing.OtrosIngresos;
                existing.MediosAjenos        = dto.CosteConciertos     ?? existing.MediosAjenos;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
