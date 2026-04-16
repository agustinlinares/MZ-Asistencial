using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

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
            return await _context.Descuadres
                .Select(d => new DescuadreDTO
                {
                    MutuaId = d.MutuaId,
                    GastoPersonal = d.GastoPersonal,
                    GastoCorrientes = d.GastoCorrientes,
                    GastosFinancieros = d.GastosFinancieros,
                    Amortizacion = d.Amortizacion,
                    TotalCostePropios = d.GastoPersonal + d.GastoCorrientes + d.GastosFinancieros + d.Amortizacion,
                    Aplicacion2581 = d.Aplicacion2581,
                    Aplicacion2582 = d.Aplicacion2582,
                    RestoArt25 = d.Resto25,
                    TotalArticulo25 = d.Aplicacion2581 + d.Aplicacion2582 + d.Resto25,
                    InversionNueva = d.InversionNueva,
                    Reposicion = d.InversionReposicion,
                    IngresosServicios = d.OtrosIngresos,
                    TotalOtrosConceptos = d.InversionNueva + d.InversionReposicion + d.OtrosIngresos,
                    PropiosConf = d.RegPropiosValidados,
                    PropiosNoConf = d.RegPropiosSinValidar,
                    ConcertConf = d.RegConcertadosValidados,
                    ConcertNoConf = d.RegConcertadosSinValidar
                })
                .ToListAsync();
        }
    }
}