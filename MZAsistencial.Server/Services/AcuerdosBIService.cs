using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public class AcuerdosBIService : IAcuerdosBIService
    {
        private readonly MZAsistencialContext _context;

        public AcuerdosBIService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AcuerdosMutuaDTO>> GetMutuasOfertaAsync(int mutuaId, int anio)
        {
            return await _context.PsAcuerdosBiMultilateralesMutuasOferta
                .Where(x => x.MutuaOfertanteId == mutuaId && x.Anio == anio)
                .Select(x => new AcuerdosMutuaDTO
                {
                    NumMutua = x.MutuaDemandanteId.ToString(),
                    MutuaNombre = null,
                    NumServicios = x.NumServicios,
                    ContraprestacionEconomica = x.ContraprestacionEconomica
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AcuerdosMutuaDTO>> GetMutuasDemandaAsync(int mutuaId, int anio)
        {
            return await _context.PsAcuerdosBiMultilateralesMutuasDemanda
                .Where(x => x.MutuaDemandanteId == mutuaId && x.Anio == anio)
                .Select(x => new AcuerdosMutuaDTO
                {
                    NumMutua = x.MutuaOfertanteId.ToString(),
                    MutuaNombre = null,
                    NumServicios = x.NumServicios,
                    ContraprestacionEconomica = x.ContraprestacionEconomica
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AcuerdosProvinciaDTO>> GetProvinciasOfertaAsync(int mutuaId, int anio)
        {
            return await _context.PsAcuerdosBiMultilateralesMutuasProvinciasOferta
                .Where(x => x.MutuaOfertanteId == mutuaId && x.Anio == anio)
                .Select(x => new AcuerdosProvinciaDTO
                {
                    NumProvincia = x.ProvinciaId,
                    Provincia = null,
                    NumServicios = x.NumServiciosBi,
                    ContraprestacionEconomica = x.ContraprestacionEconomicaBi,
                    NumServiciosTerceros = x.NumServiciosTerceros,
                    ContraprestacionEconomicaTerceros = x.ContraprestacionEconomicaTerceros
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AcuerdosProvinciaDTO>> GetProvinciasDemandaAsync(int mutuaId, int anio)
        {
            return await _context.PsAcuerdosBiMultilateralesMutuasProvinciasDemanda
                .Where(x => x.MutuaDemandanteId == mutuaId && x.Anio == anio)
                .Select(x => new AcuerdosProvinciaDTO
                {
                    NumProvincia = x.ProvinciaId,
                    Provincia = null,
                    NumServicios = x.NumServiciosBi,
                    ContraprestacionEconomica = x.ContraprestacionEconomicaBi,
                    NumServiciosTerceros = x.NumServiciosTerceros,
                    ContraprestacionEconomicaTerceros = x.ContraprestacionEconomicaTerceros
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AcuerdosTipoServicioDTO>> GetTipoServicioOfertaAsync(int mutuaId, int anio)
        {
            return await _context.PsAcuerdosBiMultilateralesMutuasTipoServicioOferta
                .Where(x => x.MutuaOfertanteId == mutuaId && x.Anio == anio)
                .Select(x => new AcuerdosTipoServicioDTO
                {
                    TipoServicio = x.NumTipoServicio,
                    TipoServicioNombre = null,
                    NumServicios = x.NumServiciosBi,
                    ContraprestacionEconomica = x.ContraprestacionEconomicaBi,
                    NumServiciosTerceros = x.NumServiciosTerceros,
                    ContraprestacionEconomicaTerceros = x.ContraprestacionEconomicaTerceros
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AcuerdosTipoServicioDTO>> GetTipoServicioDemandaAsync(int mutuaId, int anio)
        {
            return await _context.PsAcuerdosBiMultilateralesMutuasTipoServicioDemanda
                .Where(x => x.MutuaDemandanteId == mutuaId && x.Anio == anio)
                .Select(x => new AcuerdosTipoServicioDTO
                {
                    TipoServicio = x.NumTipoServicio,
                    TipoServicioNombre = null,
                    NumServicios = x.NumServiciosBi,
                    ContraprestacionEconomica = x.ContraprestacionEconomicaBi,
                    NumServiciosTerceros = x.NumServiciosTerceros,
                    ContraprestacionEconomicaTerceros = x.ContraprestacionEconomicaTerceros
                })
                .ToListAsync();
        }
    }
}