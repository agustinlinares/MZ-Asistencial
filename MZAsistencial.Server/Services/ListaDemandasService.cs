using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

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
            CentroId = x.o != null ? (int?)x.o.CentroId : null,
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
            DemandaEne = x.d.Ene,
            DemandaFeb = x.d.Feb,
            DemandaMar = x.d.Mar,
            DemandaAbr = x.d.Abr,
            DemandaMay = x.d.May,
            DemandaJun = x.d.Jun,
            DemandaJul = x.d.Jul,
            DemandaAgo = x.d.Ago,
            DemandaSep = x.d.Sep,
            DemandaOct = x.d.Oct,
            DemandaNov = x.d.Nov,
            DemandaDic = x.d.Dic,
            OfertaEne = x.o != null ? x.o.Ene : null,
            OfertaFeb = x.o != null ? x.o.Feb : null,
            OfertaMar = x.o != null ? x.o.Mar : null,
            OfertaAbr = x.o != null ? x.o.Abr : null,
            OfertaMay = x.o != null ? x.o.May : null,
            OfertaJun = x.o != null ? x.o.Jun : null,
            OfertaJul = x.o != null ? x.o.Jul : null,
            OfertaAgo = x.o != null ? x.o.Ago : null,
            OfertaSep = x.o != null ? x.o.Sep : null,
            OfertaOct = x.o != null ? x.o.Oct : null,
            OfertaNov = x.o != null ? x.o.Nov : null,
            OfertaDic = x.o != null ? x.o.Dic : null,
            OfertaId = x.o != null ? (int?)x.o.OfertaId : null,
        }).ToListAsync();

        var centrosPropiosIds = lista
            .Where(x => x.CentroConcertado == null && x.CentroId.HasValue)
            .Select(x => x.CentroId!.Value)
            .Distinct().ToList();

        var centrosPropios = await _context.CentrosPropios
            .Where(cp => centrosPropiosIds.Contains(cp.CentroId))
            .Select(cp => new { cp.CentroId, cp.Centro, cp.MutuaId })
            .ToListAsync();

        var cpDict = centrosPropios.ToDictionary(cp => cp.CentroId);

        var mutuaIds = centrosPropios.Select(cp => cp.MutuaId).Distinct().ToList();
        var mutuasDict = await _context.Mutuas
            .Where(m => mutuaIds.Contains(m.MutuaId))
            .Select(m => new { m.MutuaId, m.Mutua1 })
            .ToDictionaryAsync(m => m.MutuaId, m => m.Mutua1);

        var result = new List<ListaDemandasDTO>();

        foreach (var x in lista)
        {
            var cp = x.CentroId.HasValue && cpDict.ContainsKey(x.CentroId.Value)
                ? cpDict[x.CentroId.Value] : null;

            string? mutuaOferta = null;
            if (cp != null)
                mutuasDict.TryGetValue(cp.MutuaId, out mutuaOferta);

            string? centro = x.CentroConcertado ?? cp?.Centro;

            // Fila DEMANDA
            result.Add(new ListaDemandasDTO
            {
                RowKey = $"{x.DemandaId}_D",
                TipoLinea = "Demanda",
                DemandaId = x.DemandaId,
                Año = x.Año,
                MutuaSolicitante = x.MutuaSolicitante,
                MutuaOfertante = mutuaOferta,
                Centro = centro,
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
                Ene = x.DemandaEne,
                Feb = x.DemandaFeb,
                Mar = x.DemandaMar,
                Abr = x.DemandaAbr,
                May = x.DemandaMay,
                Jun = x.DemandaJun,
                Jul = x.DemandaJul,
                Ago = x.DemandaAgo,
                Sep = x.DemandaSep,
                Oct = x.DemandaOct,
                Nov = x.DemandaNov,
                Dic = x.DemandaDic,
                Total = (x.DemandaEne ?? 0) + (x.DemandaFeb ?? 0) + (x.DemandaMar ?? 0) +
                        (x.DemandaAbr ?? 0) + (x.DemandaMay ?? 0) + (x.DemandaJun ?? 0) +
                        (x.DemandaJul ?? 0) + (x.DemandaAgo ?? 0) + (x.DemandaSep ?? 0) +
                        (x.DemandaOct ?? 0) + (x.DemandaNov ?? 0) + (x.DemandaDic ?? 0),
                OfertaId = x.OfertaId,
            });

            // Fila ASIGNACION
            result.Add(new ListaDemandasDTO
            {
                RowKey = $"{x.DemandaId}_A",
                TipoLinea = "Asignación",
                DemandaId = x.DemandaId,
                Año = x.Año,
                MutuaSolicitante = x.MutuaSolicitante,
                MutuaOfertante = mutuaOferta,
                Centro = centro,
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
                Ene = x.OfertaEne,
                Feb = x.OfertaFeb,
                Mar = x.OfertaMar,
                Abr = x.OfertaAbr,
                May = x.OfertaMay,
                Jun = x.OfertaJun,
                Jul = x.OfertaJul,
                Ago = x.OfertaAgo,
                Sep = x.OfertaSep,
                Oct = x.OfertaOct,
                Nov = x.OfertaNov,
                Dic = x.OfertaDic,
                Total = (x.OfertaEne ?? 0) + (x.OfertaFeb ?? 0) + (x.OfertaMar ?? 0) +
                        (x.OfertaAbr ?? 0) + (x.OfertaMay ?? 0) + (x.OfertaJun ?? 0) +
                        (x.OfertaJul ?? 0) + (x.OfertaAgo ?? 0) + (x.OfertaSep ?? 0) +
                        (x.OfertaOct ?? 0) + (x.OfertaNov ?? 0) + (x.OfertaDic ?? 0),
                OfertaId = x.OfertaId,
            });
        }

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

    public async Task<bool> UpdateAsync(int id, ActualizarDemandaDTO dto)
    {
        var demanda = await _context.Demandas.FindAsync(id);
        if (demanda == null) return false;

        demanda.EstadoId = dto.EstadoId;

        await _context.SaveChangesAsync();

        if (dto.EstadoId == 8)
        {
            var subsolicitudes = await _context.DemandasSubSols
                .Where(s => s.DemandaId == id)
                .ToListAsync();

            foreach (var sub in subsolicitudes)
            {
                sub.EstadoId = 8;

                if (sub.OfertaId.HasValue)
                {
                    var oferta = await _context.Ofertas.FindAsync(sub.OfertaId.Value);
                    if (oferta != null)
                    {
                        oferta.EstadoId = 8;
                        oferta.FechaConfirmacion = DateTime.Now;
                        oferta.FechaAsignacion = DateTime.Now;
                        oferta.FechaModificacion = DateTime.Now;
                    }
                }
                else
                {
                    var ofertaVacia = new Oferta
                    {
                        CentroId = sub.CentroId,
                        EspecialidadId = demanda.EspecialidadId,
                        ServicioId = demanda.ServicioId,
                        DemandaId = id,
                        Año = demanda.Año,
                        EstadoId = 8,
                        Ene = 0,
                        Feb = 0,
                        Mar = 0,
                        Abr = 0,
                        May = 0,
                        Jun = 0,
                        Jul = 0,
                        Ago = 0,
                        Sep = 0,
                        Oct = 0,
                        Nov = 0,
                        Dic = 0,
                        FechaConfirmacion = DateTime.Now,
                        FechaAsignacion = DateTime.Now,
                        FechaModificacion = DateTime.Now,
                    };
                    _context.Ofertas.Add(ofertaVacia);
                    await _context.SaveChangesAsync();
                    sub.OfertaId = ofertaVacia.OfertaId;
                }
            }

            await _context.SaveChangesAsync();
        }

        return true;
    }
}

