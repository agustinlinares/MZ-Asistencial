using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services;

public class ListaDemandasService : IListaDemandasService
{
    private readonly MZAsistencialContext _context;

    public ListaDemandasService(MZAsistencialContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ListaDemandasDTO>> GetListaDemandasAsync(
        FiltrosListaDemandasDTO filtros, int mutuaId)
    {
        var query = from d in _context.Demandas
                    join mSol in _context.Mutuas
                        on (int?)d.MutuaDemandaId equals (int?)mSol.MutuaId into mSolJoin
                    from mSol in mSolJoin.DefaultIfEmpty()
                    join o in _context.Ofertas
                        on (int?)d.DemandaId equals (int?)o.DemandaId into ofJoin
                    from o in ofJoin.DefaultIfEmpty()
                    join mOfer in _context.Mutuas
                        on (int?)o.CentroId equals (int?)mOfer.MutuaId into mOferJoin
                    from mOfer in mOferJoin.DefaultIfEmpty()
                    join cc in _context.CentrosConcertados
                        on (int?)o.CentroId equals (int?)cc.CentroId into ccJoin
                    from cc in ccJoin.DefaultIfEmpty()
                    join e in _context.AuxEspecialidades
                        on (int?)d.EspecialidadId equals (int?)e.EspecialidadId into espJoin
                    from e in espJoin.DefaultIfEmpty()
                    join s in _context.AuxServicios
                        on (int?)d.ServicioId equals (int?)s.ServicioId into serJoin
                    from s in serJoin.DefaultIfEmpty()
                    join est in _context.AuxEstadosDemanda
                        on (int?)d.EstadoId equals (int?)est.EstadoId into estJoin
                    from est in estJoin.DefaultIfEmpty()
                    join tp in _context.AuxTiposDemanda
                        on (int?)d.TipoId equals (int?)tp.TipoId into tpJoin
                    from tp in tpJoin.DefaultIfEmpty()
                    join pob in _context.AuxPoblaciones
                        on (int?)d.Localidad equals (int?)pob.PoblacionId into pobJoin
                    from pob in pobJoin.DefaultIfEmpty()
                    join prov in _context.AuxProvincias
                        on (int?)pob.ProvinciaId equals (int?)prov.ProvinciaId into provJoin
                    from prov in provJoin.DefaultIfEmpty()
                    select new { d, mSol, o, cc, e, s, est, tp, pob, prov };

        if (filtros.EstadoId.HasValue)
            query = query.Where(x => x.d.EstadoId == filtros.EstadoId);
        if (filtros.Año.HasValue)
            query = query.Where(x => x.d.Año == filtros.Año);
        if (filtros.Tipo == "Anuales")
            query = query.Where(x => x.d.TipoId == 1);
        else if (filtros.Tipo == "Individuales")
            query = query.Where(x => x.d.TipoId == 2);
        if (filtros.FechaSolicitudDesde.HasValue)
            query = query.Where(x => x.d.FechaAlta >= filtros.FechaSolicitudDesde);
        if (filtros.FechaSolicitudHasta.HasValue)
            query = query.Where(x => x.d.FechaAlta <= filtros.FechaSolicitudHasta);
        if (filtros.FechaAsignacionDesde.HasValue)
            query = query.Where(x => x.o != null && x.o.FechaAsignacion >= filtros.FechaAsignacionDesde);
        if (filtros.FechaAsignacionHasta.HasValue)
            query = query.Where(x => x.o != null && x.o.FechaAsignacion <= filtros.FechaAsignacionHasta);
        if (filtros.FechaConfirmacionDesde.HasValue)
            query = query.Where(x => x.o != null && x.o.FechaConfirmacion >= filtros.FechaConfirmacionDesde);
        if (filtros.FechaConfirmacionHasta.HasValue)
            query = query.Where(x => x.o != null && x.o.FechaConfirmacion <= filtros.FechaConfirmacionHasta);
        if (!string.IsNullOrEmpty(filtros.NecesidadesServicio))
            query = query.Where(x => x.d.Descripcion != null && x.d.Descripcion.Contains(filtros.NecesidadesServicio));
        if (!string.IsNullOrEmpty(filtros.ContestacionNecesidades))
            query = query.Where(x => x.o != null && x.o.NotaContestacion != null && x.o.NotaContestacion.Contains(filtros.ContestacionNecesidades));
        if (filtros.DemandaId.HasValue)
            query = query.Where(x => x.d.DemandaId == filtros.DemandaId);

        var lista = await query.Select(x => new
        {
            x.d.DemandaId,
            x.d.Año,
            MutuaSolicitante = x.mSol != null ? x.mSol.Mutua1 : null,
            CentroConcertado = x.cc != null ? x.cc.Centro : null,
            x.o.CentroId,
            Localidad = x.pob != null ? x.pob.Poblacion : null,
            Especialidad = x.e != null ? x.e.Especialidad : null,
            TipoMovimiento = x.tp != null ? x.tp.Tipo : null,
            Servicio = x.s != null ? x.s.Servicio : null,
            Estado = x.est != null ? x.est.Estado : null,
            x.d.EstadoId,
            FechaSolicitud = x.d.FechaAlta,
            FechaAsignacion = x.o != null ? x.o.FechaAsignacion : null,
            FechaConfirmacion = x.o != null ? x.o.FechaConfirmacion : null,
            NecesidadesServicio = x.d.Descripcion,
            ContestacionNecesidades = x.o != null ? x.o.NotaContestacion : null,
            Ene = x.d.Ene,
            Feb = x.d.Feb,
            Mar = x.d.Mar,
            Abr = x.d.Abr,
            May = x.d.May,
            Jun = x.d.Jun,
            Jul = x.d.Jul,
            Ago = x.d.Ago,
            Sep = x.d.Sep,
            Oct = x.d.Oct,
            Nov = x.d.Nov,
            Dic = x.d.Dic,
        }).ToListAsync();

        var centrosPropiosIds = lista
            .Where(x => x.CentroConcertado == null && x.CentroId.HasValue)
            .Select(x => x.CentroId!.Value)
            .Distinct().ToList();

        var centrosPropiosDict = await _context.CentrosPropios
            .Where(cp => centrosPropiosIds.Contains(cp.CentroId))
            .Select(cp => new { cp.CentroId, cp.Centro })
            .ToListAsync();

        var cpDict = centrosPropiosDict.ToDictionary(cp => cp.CentroId, cp => cp.Centro);

        return lista.Select(x => new ListaDemandasDTO
        {
            DemandaId = x.DemandaId,
            Año = x.Año,
            MutuaSolicitante = x.MutuaSolicitante,
            Centro = x.CentroConcertado ?? (x.CentroId.HasValue && cpDict.ContainsKey(x.CentroId.Value) ? cpDict[x.CentroId.Value] : null),
            Localidad = x.Localidad,
            Especialidad = x.Especialidad,
            TipoMovimiento = x.TipoMovimiento,
            Servicio = x.Servicio,
            Estado = x.Estado,
            EstadoId = x.EstadoId,
            FechaSolicitud = x.FechaSolicitud,
            FechaAsignacion = x.FechaAsignacion,
            FechaConfirmacion = x.FechaConfirmacion,
            NecesidadesServicio = x.NecesidadesServicio,
            ContestacionNecesidades = x.ContestacionNecesidades,
            Ene = x.Ene,
            Feb = x.Feb,
            Mar = x.Mar,
            Abr = x.Abr,
            May = x.May,
            Jun = x.Jun,
            Jul = x.Jul,
            Ago = x.Ago,
            Sep = x.Sep,
            Oct = x.Oct,
            Nov = x.Nov,
            Dic = x.Dic,
            Total = (x.Ene ?? 0) + (x.Feb ?? 0) + (x.Mar ?? 0) + (x.Abr ?? 0) +
                    (x.May ?? 0) + (x.Jun ?? 0) + (x.Jul ?? 0) + (x.Ago ?? 0) +
                    (x.Sep ?? 0) + (x.Oct ?? 0) + (x.Nov ?? 0) + (x.Dic ?? 0),
        }).ToList();
    }

    public async Task<IEnumerable<object>> GetEstadosAsync()
    {
        return await _context.AuxEstadosDemanda
            .Select(e => new { e.EstadoId, e.Estado })
            .ToListAsync<object>();
    }

    public async Task<IEnumerable<int>> GetAñosAsync()
    {
        return await _context.Demandas
            .Where(d => d.Año.HasValue)
            .Select(d => d.Año!.Value)
            .Distinct()
            .OrderByDescending(a => a)
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var demanda = await _context.Demandas.FindAsync(id);
        if (demanda == null) return false;
        _context.Demandas.Remove(demanda);
        await _context.SaveChangesAsync();
        return true;
    }
}