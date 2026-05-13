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
                    join mDem in _context.Mutuas
                        on (int?)d.MutuaDemandaId equals (int?)mDem.MutuaId into mDemJoin
                    from mDem in mDemJoin.DefaultIfEmpty()
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
                    select new { o, d, mDem, cc, e, s, est, tp };

        if (filtros.EstadoId.HasValue)
            query = query.Where(x => x.o.EstadoId == filtros.EstadoId);
        if (filtros.Año.HasValue)
            query = query.Where(x => x.o.Año == filtros.Año);
        if (filtros.Tipo == "Anuales")
            query = query.Where(x => x.d != null && x.d.TipoId == 1);
        else if (filtros.Tipo == "Individuales")
            query = query.Where(x => x.d != null && x.d.TipoId == 2);
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
        if (!string.IsNullOrEmpty(filtros.NecesidadesServicio))
            query = query.Where(x => x.d != null && x.d.Descripcion != null &&
                x.d.Descripcion.Contains(filtros.NecesidadesServicio));
        if (!string.IsNullOrEmpty(filtros.ContestacionNecesidades))
            query = query.Where(x => x.o.NotaContestacion != null &&
                x.o.NotaContestacion.Contains(filtros.ContestacionNecesidades));
        if (filtros.DemandaId.HasValue)
            query = query.Where(x => x.o.DemandaId == filtros.DemandaId);

        var lista = await query.Select(x => new
        {
            x.o.OfertaId,
            Año = x.o.Año,
            MutuaDemandante = x.mDem != null ? x.mDem.Mutua1 : null,
            CentroConcertado = x.cc != null ? x.cc.Centro : null,
            CentroId = (int?)x.o.CentroId,
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

        var centrosPropiosIds = lista
            .Where(x => x.CentroConcertado == null && x.CentroId.HasValue)
            .Select(x => x.CentroId!.Value)
            .Distinct().ToList();

        var centrosPropios = await _context.CentrosPropios
            .Where(cp => centrosPropiosIds.Contains(cp.CentroId))
            .Select(cp => new { cp.CentroId, cp.Centro, cp.MutuaId, cp.PoblacionId })
            .ToListAsync();

        var cpDict = centrosPropios.ToDictionary(cp => cp.CentroId);

        var mutuaIds = centrosPropios.Select(cp => cp.MutuaId).Distinct().ToList();
        var mutuasDict = await _context.Mutuas
            .Where(m => mutuaIds.Contains(m.MutuaId))
            .Select(m => new { m.MutuaId, m.Mutua1 })
            .ToDictionaryAsync(m => m.MutuaId, m => m.Mutua1);

        var pobIds = centrosPropios
            .Where(cp => cp.PoblacionId.HasValue)
            .Select(cp => cp.PoblacionId!.Value)
            .Distinct().ToList();

        var poblaciones = await _context.AuxPoblaciones
            .Where(p => pobIds.Contains(p.PoblacionId))
            .Select(p => new { p.PoblacionId, p.Poblacion, p.ProvinciaId })
            .ToListAsync();

        var provIds = poblaciones
      .Select(p => p.ProvinciaId)
      .Distinct().ToList();

        var provincias = await _context.AuxProvincias
            .Where(p => provIds.Contains(p.ProvinciaId))
            .Select(p => new { p.ProvinciaId, p.Provincia })
            .ToDictionaryAsync(p => p.ProvinciaId, p => p.Provincia);

        var pobDict = poblaciones.ToDictionary(p => p.PoblacionId);

        var result = lista.Select(x =>
        {
            var cp = x.CentroId.HasValue && cpDict.ContainsKey(x.CentroId.Value)
                ? cpDict[x.CentroId.Value] : null;

            string? mutuaOferta = null;
            string? localidad = null;
            string? provincia = null;

            if (cp != null)
            {
                mutuasDict.TryGetValue(cp.MutuaId, out mutuaOferta);
                if (cp.PoblacionId.HasValue && pobDict.ContainsKey(cp.PoblacionId.Value))
                {
                    var pob = pobDict[cp.PoblacionId.Value];
                    localidad = pob.Poblacion;
                    if (provincias.ContainsKey(pob.ProvinciaId))
                        provincia = provincias[pob.ProvinciaId];
                }
            }

            return new ListaOfertasDTO
            {
                OfertaId = x.OfertaId,
                Año = x.Año,
                MutuaOferta = mutuaOferta,
                Centro = x.CentroConcertado ?? cp?.Centro,
                Provincia = provincia,
                Localidad = localidad,
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
            };
        }).ToList();

        return result;
    }

    public async Task<IEnumerable<object>> GetEstadosAsync()
    {
        return await _context.AuxEstadosDemanda
            .Select(e => new { e.EstadoId, e.Estado })
            .ToListAsync<object>();
    }

    public async Task<IEnumerable<int>> GetAnosAsync()
    {
        return await _context.Ofertas
            .Where(o => o.Año.HasValue)
            .Select(o => o.Año!.Value)
            .Distinct()
            .OrderByDescending(a => a)
            .ToListAsync();
    }

    public async Task<OfertaEditDTO?> GetByIdAsync(int id)
    {
        var oferta = await _context.Ofertas.FindAsync(id);
        if (oferta == null) return null;

        return new OfertaEditDTO
        {
            OfertaId = oferta.OfertaId,
            EspecialidadId = oferta.EspecialidadId,
            ServicioId = oferta.ServicioId,
            CentroId = oferta.CentroId,
            Año = oferta.Año,
            DemandaId = oferta.DemandaId,
            Ene = oferta.Ene,
            Feb = oferta.Feb,
            Mar = oferta.Mar,
            Abr = oferta.Abr,
            May = oferta.May,
            Jun = oferta.Jun,
            Jul = oferta.Jul,
            Ago = oferta.Ago,
            Sep = oferta.Sep,
            Oct = oferta.Oct,
            Nov = oferta.Nov,
            Dic = oferta.Dic,
            EstadoId = oferta.EstadoId,
            NotaContestacion = oferta.NotaContestacion,
            ContestacionPlazos = oferta.ContestacionPlazos,
        };
    }

    public async Task<bool> UpdateAsync(int id, OfertaEditDTO dto)
    {
        var oferta = await _context.Ofertas.FindAsync(id);
        if (oferta == null) return false;

        oferta.EspecialidadId = dto.EspecialidadId;
        oferta.ServicioId = dto.ServicioId;
        oferta.CentroId = dto.CentroId;
        oferta.Año = dto.Año;
        oferta.DemandaId = dto.DemandaId;
        oferta.Ene = dto.Ene; oferta.Feb = dto.Feb; oferta.Mar = dto.Mar;
        oferta.Abr = dto.Abr; oferta.May = dto.May; oferta.Jun = dto.Jun;
        oferta.Jul = dto.Jul; oferta.Ago = dto.Ago; oferta.Sep = dto.Sep;
        oferta.Oct = dto.Oct; oferta.Nov = dto.Nov; oferta.Dic = dto.Dic;
        oferta.EstadoId = dto.EstadoId;
        oferta.NotaContestacion = dto.NotaContestacion;
        oferta.ContestacionPlazos = dto.ContestacionPlazos;
        oferta.FechaModificacion = DateTime.Now;

        if (dto.EstadoId == 3 && oferta.FechaConfirmacion == null)
            oferta.FechaConfirmacion = DateTime.Now;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var oferta = await _context.Ofertas.FindAsync(id);
        if (oferta == null) return false;
        _context.Ofertas.Remove(oferta);
        await _context.SaveChangesAsync();
        return true;
    }
}