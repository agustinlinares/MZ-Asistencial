using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

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
            EspecialidadId = x.o.EspecialidadId,
            ServicioId = x.o.ServicioId,
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
            DemandaEne = x.d != null ? x.d.Ene : null,
            DemandaFeb = x.d != null ? x.d.Feb : null,
            DemandaMar = x.d != null ? x.d.Mar : null,
            DemandaAbr = x.d != null ? x.d.Abr : null,
            DemandaMay = x.d != null ? x.d.May : null,
            DemandaJun = x.d != null ? x.d.Jun : null,
            DemandaJul = x.d != null ? x.d.Jul : null,
            DemandaAgo = x.d != null ? x.d.Ago : null,
            DemandaSep = x.d != null ? x.d.Sep : null,
            DemandaOct = x.d != null ? x.d.Oct : null,
            DemandaNov = x.d != null ? x.d.Nov : null,
            DemandaDic = x.d != null ? x.d.Dic : null,
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

        // Obtener disponibilidad declarada
        var disponibilidades = await _context.VwDisponibilidads

            .Where(v => v.CentroId.HasValue && centrosPropiosIds.Contains(v.CentroId.Value))
            .ToListAsync();

        // Obtener ofertas confirmadas para calcular comprometido
        var ofertasConfirmadas = await _context.Ofertas
            .Where(o => o.CentroId.HasValue && centrosPropiosIds.Contains(o.CentroId.Value) && o.EstadoId == 3)
            .ToListAsync();

        var result = new List<ListaOfertasDTO>();

        foreach (var x in lista)
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

            // Calcular disponibilidad real
            var disp = disponibilidades.FirstOrDefault(d =>
                d.CentroId == (x.CentroId ?? 0) &&
                d.EspecialidadId == x.EspecialidadId &&
                d.ServicioId == x.ServicioId &&
                d.Año == x.Año);

            var comprometido = ofertasConfirmadas.Where(o =>
                o.CentroId == x.CentroId &&
                o.EspecialidadId == x.EspecialidadId &&
                o.ServicioId == x.ServicioId &&
                o.Año == x.Año).ToList();

            int compEne = comprometido.Sum(o => o.Ene ?? 0);
            int compFeb = comprometido.Sum(o => o.Feb ?? 0);
            int compMar = comprometido.Sum(o => o.Mar ?? 0);
            int compAbr = comprometido.Sum(o => o.Abr ?? 0);
            int compMay = comprometido.Sum(o => o.May ?? 0);
            int compJun = comprometido.Sum(o => o.Jun ?? 0);
            int compJul = comprometido.Sum(o => o.Jul ?? 0);
            int compAgo = comprometido.Sum(o => o.Ago ?? 0);
            int compSep = comprometido.Sum(o => o.Sep ?? 0);
            int compOct = comprometido.Sum(o => o.Oct ?? 0);
            int compNov = comprometido.Sum(o => o.Nov ?? 0);
            int compDic = comprometido.Sum(o => o.Dic ?? 0);
            int? dispEne = disp != null ? disp.Enero - compEne : null;
            int? dispFeb = disp != null ? disp.Febrero - compFeb : null;
            int? dispMar = disp != null ? disp.Marzo - compMar : null;
            int? dispAbr = disp != null ? disp.Abril - compAbr : null;
            int? dispMay = disp != null ? disp.Mayo - compMay : null;
            int? dispJun = disp != null ? disp.Junio - compJun : null;
            int? dispJul = disp != null ? disp.Julio - compJul : null;
            int? dispAgo = disp != null ? disp.Agosto - compAgo : null;
            int? dispSep = disp != null ? disp.Septiembre - compSep : null;
            int? dispOct = disp != null ? disp.Octubre - compOct : null;
            int? dispNov = disp != null ? disp.Noviembre - compNov : null;
            int? dispDic = disp != null ? disp.Diciembre - compDic : null;

            // Fila ASIGNACIÓN
            result.Add(new ListaOfertasDTO
            {
                RowKey = $"{x.OfertaId}_A",
                TipoLinea = "Asignación",
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
                DispEne = dispEne,
                DispFeb = dispFeb,
                DispMar = dispMar,
                DispAbr = dispAbr,
                DispMay = dispMay,
                DispJun = dispJun,
                DispJul = dispJul,
                DispAgo = dispAgo,
                DispSep = dispSep,
                DispOct = dispOct,
                DispNov = dispNov,
                DispDic = dispDic,
                DispTotal = (dispEne ?? 0) + (dispFeb ?? 0) + (dispMar ?? 0) + (dispAbr ?? 0) +
                            (dispMay ?? 0) + (dispJun ?? 0) + (dispJul ?? 0) + (dispAgo ?? 0) +
                            (dispSep ?? 0) + (dispOct ?? 0) + (dispNov ?? 0) + (dispDic ?? 0),
            });

            // Fila DEMANDA
            result.Add(new ListaOfertasDTO
            {
                RowKey = $"{x.OfertaId}_D",
                TipoLinea = "Demanda",
                OfertaId = x.OfertaId,
                Año = x.Año,
                MutuaOferta = mutuaOferta,
                Centro = x.CentroConcertado ?? cp?.Centro,
                Provincia = provincia,
                Localidad = localidad,
                Especialidad = x.Especialidad,
                TipoMovimiento = x.TipoMovimiento,
                Servicio = x.Servicio,
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
                EstadoId = x.EstadoId,
                Estado = x.Estado,
                DemandaId = x.DemandaId,
                FechaSolicitud = x.FechaSolicitud,
                FechaAsignacion = x.FechaAsignacion,
                FechaConfirmacion = x.FechaConfirmacion,
                NecesidadesServicio = x.NecesidadesServicio,
                ContestacionNecesidades = x.NotaContestacion,
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
        var oferta = await _context.Ofertas
            .Where(o => o.OfertaId == id)
            .Select(o => new {
                o.OfertaId,
                o.EspecialidadId,
                o.ServicioId,
                o.CentroId,
                o.Año,
                o.DemandaId,
                o.Ene,
                o.Feb,
                o.Mar,
                o.Abr,
                o.May,
                o.Jun,
                o.Jul,
                o.Ago,
                o.Sep,
                o.Oct,
                o.Nov,
                o.Dic,
                o.EstadoId,
                o.NotaContestacion,
                o.ContestacionPlazos
            })
            .FirstOrDefaultAsync();

        if (oferta == null) return null;

        // Demanda
        var demanda = oferta.DemandaId.HasValue
            ? await _context.Demandas
                .Where(d => d.DemandaId == oferta.DemandaId.Value)
                .Select(d => new { d.Ene, d.Feb, d.Mar, d.Abr, d.May, d.Jun, d.Jul, d.Ago, d.Sep, d.Oct, d.Nov, d.Dic })
                .FirstOrDefaultAsync()
            : null;

        // Especialidad
        var especialidad = oferta.EspecialidadId.HasValue
            ? await _context.AuxEspecialidades
                .Where(e => e.EspecialidadId == oferta.EspecialidadId.Value)
                .Select(e => e.Especialidad)
                .FirstOrDefaultAsync()
            : null;

        // Servicio
        var servicio = oferta.ServicioId.HasValue
            ? await _context.AuxServicios
                .Where(s => s.ServicioId == oferta.ServicioId.Value)
                .Select(s => s.Servicio)
                .FirstOrDefaultAsync()
            : null;

        // Estado
        var estado = oferta.EstadoId.HasValue
            ? await _context.AuxEstadosDemanda
                .Where(e => e.EstadoId == oferta.EstadoId.Value)
                .Select(e => e.Estado)
                .FirstOrDefaultAsync()
            : null;

        // Centro y Mutua
        string? centro = null;
        string? mutuaOferta = null;
        if (oferta.CentroId.HasValue)
        {
            var cp = await _context.CentrosPropios
                .Where(c => c.CentroId == oferta.CentroId.Value)
                .Select(c => new { c.Centro, c.MutuaId })
                .FirstOrDefaultAsync();
            if (cp != null)
            {
                centro = cp.Centro;
                mutuaOferta = await _context.Mutuas
                    .Where(m => m.MutuaId == cp.MutuaId)
                    .Select(m => m.Mutua1)
                    .FirstOrDefaultAsync();
            }
        }

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
            MutuaOferta = mutuaOferta,
            Centro = centro,
            Especialidad = especialidad,
            Servicio = servicio,
            Estado = estado,
            DemandaEne = demanda?.Ene,
            DemandaFeb = demanda?.Feb,
            DemandaMar = demanda?.Mar,
            DemandaAbr = demanda?.Abr,
            DemandaMay = demanda?.May,
            DemandaJun = demanda?.Jun,
            DemandaJul = demanda?.Jul,
            DemandaAgo = demanda?.Ago,
            DemandaSep = demanda?.Sep,
            DemandaOct = demanda?.Oct,
            DemandaNov = demanda?.Nov,
            DemandaDic = demanda?.Dic,
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

        if (dto.EstadoId == 3 && oferta.DemandaId.HasValue)
        {
            var demanda = await _context.Demandas.FindAsync(oferta.DemandaId.Value);
            if (demanda != null && demanda.TipoId == 2)
            {
                var subsolicitudes = await _context.DemandasSubSols
                    .Where(s => s.DemandaId == oferta.DemandaId && s.OfertaId != id)
                    .ToListAsync();

                foreach (var sub in subsolicitudes)
                {
                    if (sub.OfertaId.HasValue)
                    {
                        var ofertaRechazada = await _context.Ofertas.FindAsync(sub.OfertaId.Value);
                        if (ofertaRechazada != null)
                        {
                            ofertaRechazada.EstadoId = 8;
                            ofertaRechazada.FechaConfirmacion = DateTime.Now;
                            ofertaRechazada.FechaAsignacion = DateTime.Now;
                            ofertaRechazada.FechaModificacion = DateTime.Now;
                        }
                    }
                    else
                    {
                        var ofertaVacia = new Oferta
                        {
                            CentroId = sub.CentroId,
                            EspecialidadId = oferta.EspecialidadId,
                            ServicioId = oferta.ServicioId,
                            DemandaId = oferta.DemandaId,
                            Año = oferta.Año,
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
                        sub.EstadoId = 8;
                    }
                    sub.EstadoId = 8;
                }

                demanda.EstadoId = 3;
                await _context.SaveChangesAsync();
            }
        }

        if (dto.EstadoId == 8 && oferta.DemandaId.HasValue)
        {
            var demanda = await _context.Demandas.FindAsync(oferta.DemandaId.Value);
            if (demanda != null && demanda.TipoId == 2)
            {
                var todasSubsolicitudes = await _context.DemandasSubSols
                    .Where(s => s.DemandaId == id)
                    .ToListAsync();

                foreach (var sub in todasSubsolicitudes)
                {
                    sub.EstadoId = 8;
                    if (sub.OfertaId.HasValue)
                    {
                        var ofertaSub = await _context.Ofertas.FindAsync(sub.OfertaId.Value);
                        if (ofertaSub != null)
                        {
                            ofertaSub.EstadoId = 8;
                            ofertaSub.FechaConfirmacion = DateTime.Now;
                            ofertaSub.FechaAsignacion = DateTime.Now;
                            ofertaSub.FechaModificacion = DateTime.Now;
                        }
                    }
                    else
                    {
                        var ofertaVacia = new Oferta
                        {
                            CentroId = sub.CentroId,
                            EspecialidadId = oferta.EspecialidadId,
                            ServicioId = oferta.ServicioId,
                            DemandaId = oferta.DemandaId,
                            Año = oferta.Año,
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

                demanda.EstadoId = 8;
                await _context.SaveChangesAsync();
            }
        }

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
