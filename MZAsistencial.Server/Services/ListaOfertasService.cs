using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services;

public class ListaOfertasService : IListaOfertasService
{
    private readonly MZAsistencialContext _context;

    public ListaOfertasService(MZAsistencialContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ListaOfertasDTO>> GetListaOfertasAsync(
        FiltrosListaOfertasDTO filtros, int mutuaId)
    {
        var query = from o in _context.Ofertas
                    join d in _context.Demandas
                        on (int?)o.DemandaId equals (int?)d.DemandaId into demJoin
                    from d in demJoin.DefaultIfEmpty()
                    join m in _context.Mutuas
                        on (int?)d.MutuaDemandaId equals (int?)m.MutuaId into mutJoin
                    from m in mutJoin.DefaultIfEmpty()
                    join cc in _context.CentrosConcertados
                        on (int?)o.CentroId equals (int?)cc.CentroId into ccJoin
                    from cc in ccJoin.DefaultIfEmpty()
                    join e in _context.AuxEspecialidades
                        on (int?)o.EspecialidadId equals (int?)e.EspecialidadId into espJoin
                    from e in espJoin.DefaultIfEmpty()
                    join s in _context.AuxServicios
                        on (int?)o.ServicioId equals (int?)s.ServicioId into serJoin
                    from s in serJoin.DefaultIfEmpty()
                    join est in _context.AuxEstadosDemanda
                        on (int?)o.EstadoId equals (int?)est.EstadoId into estJoin
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
                    select new { o, d, m, cc, e, s, est, tp, pob, prov };

        // Filtro Estado
        if (filtros.EstadoId.HasValue)
            query = query.Where(x => x.o.EstadoId == filtros.EstadoId);

        // Filtro Año
        if (filtros.Año.HasValue)
            query = query.Where(x => x.o.Año == filtros.Año);

        // Filtro Tipo
        if (filtros.Tipo == "Anuales")
            query = query.Where(x => x.d != null && x.d.TipoId == 1);
        else if (filtros.Tipo == "Individuales")
            query = query.Where(x => x.d != null && x.d.TipoId == 2);

        // Filtros de fecha
        if (filtros.FechaSolicitudDesde.HasValue)
            query = query.Where(x => x.d != null && x.d.FechaAlta >= filtros.FechaSolicitudDesde);
        if (filtros.FechaSolicitudHasta.HasValue)
            query = query.Where(x => x.d != null && x.d.FechaAlta <= filtros.FechaSolicitudHasta);
        if (filtros.FechaAsignacionDesde.HasValue)
            query = query.Where(x => x.o.FechaAsignacion >= filtros.FechaAsignacionDesde);
        if (filtros.FechaAsignacionHasta.HasValue)
            query = query.Where(x => x.o.FechaAsignacion <= filtros.FechaAsignacionHasta);
        if (filtros.FechaConfirmacionDesde.HasValue)
            query = query.Where(x => x.o.FechaConfirmacion >= filtros.FechaConfirmacionDesde);
        if (filtros.FechaConfirmacionHasta.HasValue)
            query = query.Where(x => x.o.FechaConfirmacion <= filtros.FechaConfirmacionHasta);

        // Filtros texto
        if (!string.IsNullOrEmpty(filtros.NecesidadesServicio))
            query = query.Where(x => x.d != null &&
                x.d.Descripcion != null &&
                x.d.Descripcion.Contains(filtros.NecesidadesServicio));
        if (!string.IsNullOrEmpty(filtros.ContestacionNecesidades))
            query = query.Where(x => x.o.NotaContestacion != null &&
                x.o.NotaContestacion.Contains(filtros.ContestacionNecesidades));
        if (filtros.DemandaId.HasValue)
            query = query.Where(x => x.o.DemandaId == filtros.DemandaId);

        // Traer datos a memoria para resolver CentrosPropios (HasNoKey)
        var lista = await query.Select(x => new
        {
            x.o.OfertaId,
            x.o.Año,
            MutuaOferta = x.m != null ? x.m.Mutua1 : null,
            CentroConcertado = x.cc != null ? x.cc.Centro : null,
            x.o.CentroId,
            Provincia = x.prov != null ? x.prov.Provincia : null,
            Localidad = x.pob != null ? x.pob.Poblacion : null,
            Especialidad = x.e != null ? x.e.Especialidad : null,
            TipoMovimiento = x.tp != null ? x.tp.Tipo : null,
            Servicio = x.s != null ? x.s.Servicio : null,
            x.o.Ene,
            x.o.Feb,
            x.o.Mar,
            x.o.Abr,
            x.o.May,
            x.o.Jun,
            x.o.Jul,
            x.o.Ago,
            x.o.Sep,
            x.o.Oct,
            x.o.Nov,
            x.o.Dic,
            x.o.EstadoId,
            Estado = x.est != null ? x.est.Estado : null,
            x.o.DemandaId,
            FechaSolicitud = x.d != null ? x.d.FechaAlta : null,
            x.o.FechaAsignacion,
            x.o.FechaConfirmacion,
            NecesidadesServicio = x.d != null ? x.d.Descripcion : null,
            x.o.NotaContestacion,
        }).ToListAsync();

        // Resolver centros propios en memoria
        var centrosPropiosIds = lista
            .Where(x => x.CentroConcertado == null && x.CentroId.HasValue)
            .Select(x => x.CentroId!.Value)
            .Distinct()
            .ToList();

        var centrosPropiosNombres = await _context.CentrosPropios
            .Where(cp => centrosPropiosIds.Contains(cp.CentroId))
            .Select(cp => new { cp.CentroId, cp.Centro })
            .ToListAsync();

        var centrosPropiosDict = centrosPropiosNombres
            .ToDictionary(cp => cp.CentroId, cp => cp.Centro);

        var result = lista.Select(x => new ListaOfertasDTO
        {
            OfertaId = x.OfertaId,
            Año = x.Año,
            MutuaOferta = x.MutuaOferta,
            Centro = x.CentroConcertado
                                      ?? (x.CentroId.HasValue && centrosPropiosDict.ContainsKey(x.CentroId.Value)
                                          ? centrosPropiosDict[x.CentroId.Value]
                                          : null),
            Provincia = x.Provincia,
            Localidad = x.Localidad,
            Especialidad = x.Especialidad,
            TipoMovimiento = x.TipoMovimiento,
            Servicio = x.Servicio,
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
            Total = (x.Ene ?? 0) + (x.Feb ?? 0) + (x.Mar ?? 0) +
                                      (x.Abr ?? 0) + (x.May ?? 0) + (x.Jun ?? 0) +
                                      (x.Jul ?? 0) + (x.Ago ?? 0) + (x.Sep ?? 0) +
                                      (x.Oct ?? 0) + (x.Nov ?? 0) + (x.Dic ?? 0),
            EstadoId = x.EstadoId,
            Estado = x.Estado,
            DemandaId = x.DemandaId,
            FechaSolicitud = x.FechaSolicitud,
            FechaAsignacion = x.FechaAsignacion,
            FechaConfirmacion = x.FechaConfirmacion,
            NecesidadesServicio = x.NecesidadesServicio,
            ContestacionNecesidades = x.NotaContestacion,
        }).ToList();

        return result;
    }

    public async Task<IEnumerable<object>> GetEstadosAsync()
    {
        return await _context.AuxEstadosDemanda
            .Select(e => new { e.EstadoId, e.Estado })
            .ToListAsync<object>();
    }

    public async Task<IEnumerable<int>> GetAñosAsync()
    {
        return await _context.Ofertas
            .Where(o => o.Año.HasValue)
            .Select(o => o.Año!.Value)
            .Distinct()
            .OrderByDescending(a => a)
            .ToListAsync();
    }
}