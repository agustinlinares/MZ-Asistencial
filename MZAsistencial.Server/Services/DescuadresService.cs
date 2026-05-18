using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class DescuadresService : IDescuadresService
    {
        private readonly MZAsistencialContext _context;

        public DescuadresService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DescuadreDTO>> GetDescuadresAsync()
        {
            // 1. Obtener todas las mutuas activas
            var mutuas = await _context.Mutuas
                .Where(m => m.FechaBaja == null)
                .OrderBy(m => m.MutuaId)
                .ToListAsync();

            // 2. Calcular Reg* desde las vistas agrupando por MutuaId
            var propiosValidados = await _context.VwPropiosValidados
                .GroupBy(v => v.MutuaId)
                .Select(g => new { MutuaId = g.Key, Count = g.Count() })
                .ToListAsync();

            var propiosNoValidados = await _context.VwPropiosNoValidados
                .GroupBy(v => v.MutuaId)
                .Select(g => new { MutuaId = g.Key, Count = g.Count() })
                .ToListAsync();

            var concertadosValidados = await _context.VwConcertadosValidados
                .GroupBy(v => v.MutuaId)
                .Select(g => new { MutuaId = g.Key, Count = g.Count() })
                .ToListAsync();

            var concertadosNoValidados = await _context.VwConcertadosNoValidados
                .GroupBy(v => v.MutuaId)
                .Select(g => new { MutuaId = g.Key, Count = g.Count() })
                .ToListAsync();

            // 3. Obtener descuadres existentes en BD
            var descuadresExistentes = await _context.Descuadres
                .ToListAsync();

            // 4. Construir resultado: una fila por mutua
            var result = mutuas.Select(m =>
            {
                var d = descuadresExistentes.FirstOrDefault(x => x.MutuaId == m.MutuaId);

                decimal gp  = d?.GastoPersonal      ?? 0;
                decimal gc  = d?.GastoCorrientes     ?? 0;
                decimal gf  = d?.GastosFinancieros   ?? 0;
                decimal am  = d?.Amortizacion        ?? 0;
                decimal a81 = d?.Aplicacion2581      ?? 0;
                decimal a82 = d?.Aplicacion2582      ?? 0;
                decimal r25 = d?.Resto25             ?? 0;
                decimal inv = d?.InversionNueva      ?? 0;
                decimal rep = d?.InversionReposicion ?? 0;
                decimal oi  = d?.OtrosIngresos       ?? 0;
                decimal ma  = d?.MediosAjenos        ?? 0;

                decimal totalCostePropios  = gp + gc + gf + am;
                decimal totalArticulo25    = a81 + a82 + r25;
                decimal totalOtrosConceptos = inv + rep + oi;
                decimal totalGeneral       = totalCostePropios + totalArticulo25 + totalOtrosConceptos;

                int regPropVal   = propiosValidados.FirstOrDefault(x => x.MutuaId == m.MutuaId)?.Count ?? 0;
                int regPropNoVal = propiosNoValidados.FirstOrDefault(x => x.MutuaId == m.MutuaId)?.Count ?? 0;
                int regConcVal   = concertadosValidados.FirstOrDefault(x => x.MutuaId == m.MutuaId)?.Count ?? 0;
                int regConcNoVal = concertadosNoValidados.FirstOrDefault(x => x.MutuaId == m.MutuaId)?.Count ?? 0;

                return new DescuadreDTO
                {
                    MutuaId             = m.MutuaId,
                    Mutua               = m.Mutua1,
                    GastoPersonal       = gp,
                    GastoCorrientes     = gc,
                    GastosFinancieros   = gf,
                    Amortizacion        = am,
                    TotalCostePropios   = totalCostePropios,
                    CosteConciertos     = ma,
                    Aplicacion2581      = a81,
                    Aplicacion2582      = a82,
                    RestoArt25          = r25,
                    TotalArticulo25     = totalArticulo25,
                    InversionNueva      = inv,
                    Reposicion          = rep,
                    IngresosServicios   = oi,
                    TotalOtrosConceptos = totalOtrosConceptos,
                    TotalGeneral        = totalGeneral,
                    PropiosConf         = regPropVal,
                    PropiosNoConf       = regPropNoVal,
                    ConcertConf         = regConcVal,
                    ConcertNoConf       = regConcNoVal,
                };
            }).ToList();

            return result;
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
