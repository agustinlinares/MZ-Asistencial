using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.Data.SqlClient;

namespace MZAsistencial.Server.Services;

public class ListaDemandasService : IListaDemandasService
{
    private readonly MZAsistencialContext _context;

    public ListaDemandasService(MZAsistencialContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ListaDemandasDTO>> GetListaDemandasAsync(FiltrosListaDemandasDTO filtros, int mutuaId)
    {
        var whereClauses = new List<string>();
        var parameters = new List<SqlParameter>();

        if (filtros.Año.HasValue)
        {
            whereClauses.Add("d.Año = @anio");
            parameters.Add(new SqlParameter("@anio", System.Data.SqlDbType.Int) { Value = filtros.Año.Value });
        }
        if (filtros.EstadoId.HasValue)
        {
            whereClauses.Add("d.Estado_id = @estadoId");
            parameters.Add(new SqlParameter("@estadoId", System.Data.SqlDbType.Int) { Value = filtros.EstadoId.Value });
        }
        if (filtros.Tipo == "Anuales")
            whereClauses.Add("d.Tipo_id = 1");
        else if (filtros.Tipo == "Individuales")
            whereClauses.Add("d.Tipo_id = 2");
        if (filtros.DemandaId.HasValue)
        {
            whereClauses.Add("d.Demanda_id = @demandaId");
            parameters.Add(new SqlParameter("@demandaId", System.Data.SqlDbType.Int) { Value = filtros.DemandaId.Value });
        }
        if (filtros.FechaSolicitudDesde.HasValue)
        {
            whereClauses.Add("d.FechaAlta >= @fsdDesde");
            parameters.Add(new SqlParameter("@fsdDesde", System.Data.SqlDbType.DateTime) { Value = filtros.FechaSolicitudDesde.Value });
        }
        if (filtros.FechaSolicitudHasta.HasValue)
        {
            whereClauses.Add("d.FechaAlta <= @fsdHasta");
            parameters.Add(new SqlParameter("@fsdHasta", System.Data.SqlDbType.DateTime) { Value = filtros.FechaSolicitudHasta.Value });
        }
        if (!string.IsNullOrEmpty(filtros.NecesidadesServicio))
        {
            whereClauses.Add("d.Descripcion LIKE @necesidades");
            parameters.Add(new SqlParameter("@necesidades", System.Data.SqlDbType.NVarChar) { Value = $"%{filtros.NecesidadesServicio}%" });
        }

        var where = whereClauses.Count > 0
            ? "WHERE " + string.Join(" AND ", whereClauses)
            : "";

        var sql = $@"
            SELECT
                d.Demanda_id        AS DemandaId,
                d.Año,
                mSol.Mutua          AS MutuaSolicitante,
                o.Oferta_id         AS OfertaId,
                o.Centro_id         AS CentroId,
                o.FechaAsignacion,
                o.FechaConfirmacion,
                o.NotaContestacion  AS ContestacionNecesidades,
                o.Ene  AS OfertaEne,  o.Feb  AS OfertaFeb,  o.Mar  AS OfertaMar,
                o.Abr  AS OfertaAbr,  o.May  AS OfertaMay,  o.Jun  AS OfertaJun,
                o.Jul  AS OfertaJul,  o.Ago  AS OfertaAgo,  o.Sep  AS OfertaSep,
                o.Oct  AS OfertaOct,  o.Nov  AS OfertaNov,  o.Dic  AS OfertaDic,
                d.Ene  AS DemandaEne, d.Feb  AS DemandaFeb, d.Mar  AS DemandaMar,
                d.Abr  AS DemandaAbr, d.May  AS DemandaMay, d.Jun  AS DemandaJun,
                d.Jul  AS DemandaJul, d.Ago  AS DemandaAgo, d.Sep  AS DemandaSep,
                d.Oct  AS DemandaOct, d.Nov  AS DemandaNov, d.Dic  AS DemandaDic,
                d.Estado_id         AS EstadoId,
                est.Estado,
                d.FechaAlta         AS FechaSolicitud,
                d.Descripcion       AS NecesidadesServicio,
                d.Tipo_id           AS TipoId,
                e.Especialidad,
                s.Servicio,
                tp.Tipo             AS TipoMovimiento,
                pob.Poblacion       AS Localidad
            FROM Demandas d
            LEFT JOIN Mutuas mSol             ON d.MutuaDemanda_id = mSol.Mutua_id
            LEFT JOIN (
                SELECT o2.Demanda_id,
                       MIN(o2.Oferta_id)         AS Oferta_id,
                       MIN(o2.Centro_id)         AS Centro_id,
                       MIN(o2.FechaAsignacion)   AS FechaAsignacion,
                       MIN(o2.FechaConfirmacion) AS FechaConfirmacion,
                       MAX(o2.NotaContestacion)  AS NotaContestacion,
                       SUM(ISNULL(o2.Ene,0)) AS Ene, SUM(ISNULL(o2.Feb,0)) AS Feb,
                       SUM(ISNULL(o2.Mar,0)) AS Mar, SUM(ISNULL(o2.Abr,0)) AS Abr,
                       SUM(ISNULL(o2.May,0)) AS May, SUM(ISNULL(o2.Jun,0)) AS Jun,
                       SUM(ISNULL(o2.Jul,0)) AS Jul, SUM(ISNULL(o2.Ago,0)) AS Ago,
                       SUM(ISNULL(o2.Sep,0)) AS Sep, SUM(ISNULL(o2.Oct,0)) AS Oct,
                       SUM(ISNULL(o2.Nov,0)) AS Nov, SUM(ISNULL(o2.Dic,0)) AS Dic
                FROM Ofertas o2
                GROUP BY o2.Demanda_id
            ) o ON d.Demanda_id = o.Demanda_id
            LEFT JOIN Aux_Especialidades e    ON d.Especialidad_id = e.Especialidad_id
            LEFT JOIN Aux_Servicios s         ON d.Servicio_id = s.Servicio_id
            LEFT JOIN Aux_Estados_Demanda est ON d.Estado_id = est.Estado_id
            LEFT JOIN Aux_TiposDemanda tp     ON d.Tipo_id = tp.Tipo_id
            LEFT JOIN Aux_Poblaciones pob     ON d.Localidad = pob.Poblacion_id
            {where}
            ORDER BY d.Demanda_id";

        var connStr = _context.Database.GetConnectionString()!;
        await using var conn = new SqlConnection(connStr);
        await conn.OpenAsync();

        var lista = new List<dynamic>();
        await using var cmd = new SqlCommand(sql, conn);
        foreach (var p in parameters)
            cmd.Parameters.Add(p);

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            lista.Add(new
            {
                DemandaId = reader.GetInt32(reader.GetOrdinal("DemandaId")),
                Año = reader.IsDBNull(reader.GetOrdinal("Año")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("Año")),
                MutuaSolicitante = reader.IsDBNull(reader.GetOrdinal("MutuaSolicitante")) ? null : reader.GetString(reader.GetOrdinal("MutuaSolicitante")),
                OfertaId = reader.IsDBNull(reader.GetOrdinal("OfertaId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaId")),
                CentroId = reader.IsDBNull(reader.GetOrdinal("CentroId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("CentroId")),
                FechaAsignacion = reader.IsDBNull(reader.GetOrdinal("FechaAsignacion")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("FechaAsignacion")),
                FechaConfirmacion = reader.IsDBNull(reader.GetOrdinal("FechaConfirmacion")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("FechaConfirmacion")),
                ContestacionNecesidades = reader.IsDBNull(reader.GetOrdinal("ContestacionNecesidades")) ? null : reader.GetString(reader.GetOrdinal("ContestacionNecesidades")),
                OfertaEne = reader.IsDBNull(reader.GetOrdinal("OfertaEne")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaEne")),
                OfertaFeb = reader.IsDBNull(reader.GetOrdinal("OfertaFeb")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaFeb")),
                OfertaMar = reader.IsDBNull(reader.GetOrdinal("OfertaMar")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaMar")),
                OfertaAbr = reader.IsDBNull(reader.GetOrdinal("OfertaAbr")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaAbr")),
                OfertaMay = reader.IsDBNull(reader.GetOrdinal("OfertaMay")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaMay")),
                OfertaJun = reader.IsDBNull(reader.GetOrdinal("OfertaJun")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaJun")),
                OfertaJul = reader.IsDBNull(reader.GetOrdinal("OfertaJul")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaJul")),
                OfertaAgo = reader.IsDBNull(reader.GetOrdinal("OfertaAgo")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaAgo")),
                OfertaSep = reader.IsDBNull(reader.GetOrdinal("OfertaSep")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaSep")),
                OfertaOct = reader.IsDBNull(reader.GetOrdinal("OfertaOct")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaOct")),
                OfertaNov = reader.IsDBNull(reader.GetOrdinal("OfertaNov")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaNov")),
                OfertaDic = reader.IsDBNull(reader.GetOrdinal("OfertaDic")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("OfertaDic")),
                DemandaEne = reader.IsDBNull(reader.GetOrdinal("DemandaEne")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaEne")),
                DemandaFeb = reader.IsDBNull(reader.GetOrdinal("DemandaFeb")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaFeb")),
                DemandaMar = reader.IsDBNull(reader.GetOrdinal("DemandaMar")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaMar")),
                DemandaAbr = reader.IsDBNull(reader.GetOrdinal("DemandaAbr")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaAbr")),
                DemandaMay = reader.IsDBNull(reader.GetOrdinal("DemandaMay")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaMay")),
                DemandaJun = reader.IsDBNull(reader.GetOrdinal("DemandaJun")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaJun")),
                DemandaJul = reader.IsDBNull(reader.GetOrdinal("DemandaJul")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaJul")),
                DemandaAgo = reader.IsDBNull(reader.GetOrdinal("DemandaAgo")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaAgo")),
                DemandaSep = reader.IsDBNull(reader.GetOrdinal("DemandaSep")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaSep")),
                DemandaOct = reader.IsDBNull(reader.GetOrdinal("DemandaOct")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaOct")),
                DemandaNov = reader.IsDBNull(reader.GetOrdinal("DemandaNov")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaNov")),
                DemandaDic = reader.IsDBNull(reader.GetOrdinal("DemandaDic")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DemandaDic")),
                EstadoId = reader.IsDBNull(reader.GetOrdinal("EstadoId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("EstadoId")),
                Estado = reader.IsDBNull(reader.GetOrdinal("Estado")) ? null : reader.GetString(reader.GetOrdinal("Estado")),
                FechaSolicitud = reader.IsDBNull(reader.GetOrdinal("FechaSolicitud")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("FechaSolicitud")),
                NecesidadesServicio = reader.IsDBNull(reader.GetOrdinal("NecesidadesServicio")) ? null : reader.GetString(reader.GetOrdinal("NecesidadesServicio")),
                Especialidad = reader.IsDBNull(reader.GetOrdinal("Especialidad")) ? null : reader.GetString(reader.GetOrdinal("Especialidad")),
                Servicio = reader.IsDBNull(reader.GetOrdinal("Servicio")) ? null : reader.GetString(reader.GetOrdinal("Servicio")),
                TipoMovimiento = reader.IsDBNull(reader.GetOrdinal("TipoMovimiento")) ? null : reader.GetString(reader.GetOrdinal("TipoMovimiento")),
                Localidad = reader.IsDBNull(reader.GetOrdinal("Localidad")) ? null : reader.GetString(reader.GetOrdinal("Localidad")),
            });
        }

        var centroIds = lista.Where(x => x.CentroId != null).Select(x => (int)x.CentroId).Distinct().ToList();

        var centrosPropios = centroIds.Count > 0
            ? await _context.CentrosPropios.Where(cp => centroIds.Contains(cp.CentroId)).Select(cp => new { cp.CentroId, cp.Centro, cp.MutuaId }).ToListAsync()
            : new();

        var centrosConcertados = centroIds.Count > 0
            ? await _context.CentrosConcertados.Where(cc => centroIds.Contains(cc.CentroId)).Select(cc => new { cc.CentroId, cc.Centro }).ToListAsync()
            : new();

        var cpDict = centrosPropios.ToDictionary(cp => (int)cp.CentroId);
        var ccDict = centrosConcertados.ToDictionary(cc => (int)cc.CentroId);

        var mutuaIdsList = centrosPropios.Select(cp => (int)cp.MutuaId).Distinct().ToList();
        var mutuasDict = mutuaIdsList.Count > 0
            ? await _context.Mutuas.Where(m => mutuaIdsList.Contains(m.MutuaId)).ToDictionaryAsync(m => m.MutuaId, m => m.Mutua1)
            : new Dictionary<int, string?>();

        var result = new List<ListaDemandasDTO>();

        foreach (var x in lista)
        {
            string? mutuaOferta = null;
            string? centro = null;
            int? centroId = x.CentroId;

            if (centroId.HasValue)
            {
                if (cpDict.TryGetValue(centroId.Value, out var cp))
                {
                    centro = cp.Centro;
                    mutuasDict.TryGetValue((int)cp.MutuaId, out mutuaOferta);
                }
                else if (ccDict.TryGetValue(centroId.Value, out var cc))
                {
                    centro = cc.Centro;
                }
            }

            string grupoKey = string.Join(" | ", new[] { $"Año: {x.Año}", $"Mutua: {mutuaOferta ?? "-"}", $"Centro: {centro ?? "-"}", $"Especialidad: {x.Especialidad ?? "-"}", $"Servicio: {x.Servicio ?? "-"}", $"Población: {x.Localidad ?? "-"}", $"Demanda: {x.DemandaId}" });

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
                Total = (x.DemandaEne ?? 0) + (x.DemandaFeb ?? 0) + (x.DemandaMar ?? 0) + (x.DemandaAbr ?? 0) + (x.DemandaMay ?? 0) + (x.DemandaJun ?? 0) + (x.DemandaJul ?? 0) + (x.DemandaAgo ?? 0) + (x.DemandaSep ?? 0) + (x.DemandaOct ?? 0) + (x.DemandaNov ?? 0) + (x.DemandaDic ?? 0),
                OfertaId = x.OfertaId,
                GrupoKey = grupoKey,
            });

            result.Add(new ListaDemandasDTO
            {
                RowKey = $"{x.DemandaId}_A",
                TipoLinea = "Oferta",
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
                Total = (x.OfertaEne ?? 0) + (x.OfertaFeb ?? 0) + (x.OfertaMar ?? 0) + (x.OfertaAbr ?? 0) + (x.OfertaMay ?? 0) + (x.OfertaJun ?? 0) + (x.OfertaJul ?? 0) + (x.OfertaAgo ?? 0) + (x.OfertaSep ?? 0) + (x.OfertaOct ?? 0) + (x.OfertaNov ?? 0) + (x.OfertaDic ?? 0),
                OfertaId = x.OfertaId,
                GrupoKey = grupoKey,
            });
        }

        return result;
    }

    public async Task<IEnumerable<object>> GetEstadosAsync()
    {
        return await _context.AuxEstadosDemanda.Select(e => new { e.EstadoId, e.Estado }).ToListAsync<object>();
    }

    public async Task<IEnumerable<int>> GetAñosAsync()
    {
        return await _context.Demandas.Where(d => d.Año.HasValue).Select(d => d.Año!.Value).Distinct().OrderByDescending(a => a).ToListAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var demanda = await _context.Demandas.FindAsync(id);
        if (demanda == null) return false;
        _context.Demandas.Remove(demanda);
        await _context.SaveChangesAsync();
        return true;
    }

    // UPDATE PARA ANULAR UNA DEMANDA ENTERA (Estado 8 general)
    public async Task<bool> UpdateAsync(int id, ActualizarDemandaDTO dto)
    {
        var demanda = await _context.Demandas.FindAsync(id);
        if (demanda == null) return false;

        demanda.EstadoId = dto.EstadoId;
        await _context.SaveChangesAsync();

        if (dto.EstadoId == 8)
        {
            var subsolicitudes = await _context.DemandasSubSols.Where(s => s.DemandaId == id).ToListAsync();

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

    
    public async Task<bool> UpdateAsync(int id, DemandaUpdateDTO dto)
    {
        var demanda = await _context.Demandas.FindAsync(id);
        if (demanda == null) return false;

        if (dto.EstadoId.HasValue) demanda.EstadoId = dto.EstadoId;
        if (!string.IsNullOrEmpty(dto.MotivoAnulacion)) demanda.MotivoAnulacion = dto.MotivoAnulacion;
        if (!string.IsNullOrEmpty(dto.MotivoRechazo)) demanda.MotivoRechazo = dto.MotivoRechazo;

        // Lógica: Si confirmamos una cita (Estado 3) y es Individual (Tipo 2), se asigna la elegida y se rechazan las demás
        if (demanda.TipoId == 2 && dto.EstadoId == 3 && dto.SubSolId.HasValue)
        {
            var subsolicitudes = await _context.DemandasSubSols
                .Where(s => s.DemandaId == id)
                .ToListAsync();

            foreach (var sub in subsolicitudes)
            {
                if (sub.DemandasSubSolId == dto.SubSolId.Value)
                {
                    
                    sub.EstadoId = 3;
                    if (sub.OfertaId.HasValue)
                    {
                        var oferta = await _context.Ofertas.FindAsync(sub.OfertaId.Value);
                        if (oferta != null)
                        {
                            oferta.EstadoId = 3;
                            oferta.FechaConfirmacion = DateTime.Now;
                            oferta.FechaAsignacion = DateTime.Now;
                            oferta.FechaModificacion = DateTime.Now;
                        }
                    }
                }
                else
                {
                    
                    sub.EstadoId = 8;
                    if (sub.OfertaId.HasValue)
                    {
                        var oferta = await _context.Ofertas.FindAsync(sub.OfertaId.Value);
                        if (oferta != null)
                        {
                            oferta.EstadoId = 8;
                            oferta.FechaModificacion = DateTime.Now;
                        }
                    }
                    else
                    {
                        // Creamos una oferta vacía de auditoría para el rechazo
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
                            FechaModificacion = DateTime.Now
                        };
                        _context.Ofertas.Add(ofertaVacia);
                        await _context.SaveChangesAsync(); 
                        sub.OfertaId = ofertaVacia.OfertaId;
                    }
                }
            }
        }
        // Anular: volver todas las subsolicitudes a estado 1
        if (dto.EstadoId == 9)
        {
            var subs = await _context.DemandasSubSols
                .Where(s => s.DemandaId == id)
                .ToListAsync();

            foreach (var sub in subs)
            {
                sub.EstadoId = 1;
                if (sub.OfertaId.HasValue)
                {
                    var oferta = await _context.Ofertas.FindAsync(sub.OfertaId.Value);
                    if (oferta != null)
                    {
                        oferta.EstadoId = 1;
                        oferta.FechaConfirmacion = null;
                        oferta.FechaAsignacion = null;
                        oferta.FechaModificacion = DateTime.Now;
                    }
                }
            }            
            await _context.SaveChangesAsync();
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DemandaEditDTO?> GetByIdAsync(int id)
    {
        var demanda = await _context.Demandas.Where(d => d.DemandaId == id).FirstOrDefaultAsync();
        if (demanda == null) return null;

        var especialidad = demanda.EspecialidadId.HasValue
            ? await _context.AuxEspecialidades.Where(e => e.EspecialidadId == demanda.EspecialidadId.Value).Select(e => e.Especialidad).FirstOrDefaultAsync()
            : null;
        var servicio = demanda.ServicioId.HasValue
            ? await _context.AuxServicios.Where(s => s.ServicioId == demanda.ServicioId.Value).Select(s => s.Servicio).FirstOrDefaultAsync()
            : null;
        var estado = demanda.EstadoId.HasValue
            ? await _context.AuxEstadosDemanda.Where(e => e.EstadoId == demanda.EstadoId.Value).Select(e => e.Estado).FirstOrDefaultAsync()
            : null;
        var mutuaSolicitante = demanda.MutuaDemandaId.HasValue
            ? await _context.Mutuas.Where(m => m.MutuaId == demanda.MutuaDemandaId.Value).Select(m => m.Mutua1).FirstOrDefaultAsync()
            : null;

        string? localidad = null; string? provincia = null;
        if (demanda.Localidad.HasValue)
        {
            var pob = await _context.AuxPoblaciones.Where(p => p.PoblacionId == demanda.Localidad.Value).Select(p => new { p.Poblacion, p.ProvinciaId }).FirstOrDefaultAsync();
            if (pob != null)
            {
                localidad = pob.Poblacion;
                provincia = await _context.AuxProvincias.Where(p => p.ProvinciaId == pob.ProvinciaId).Select(p => p.Provincia).FirstOrDefaultAsync();
            }
        }

        var ofertaConfirmada = await _context.Ofertas.Where(o => o.DemandaId == id && o.EstadoId == 3).OrderByDescending(o => o.FechaConfirmacion).FirstOrDefaultAsync();

        string? mutuaOfertante = null; string? centroDemanda = null;
        string? direccionCentro = null; string? telefono = null;
        if (ofertaConfirmada?.CentroId.HasValue == true)
        {
            var cpOferta = await _context.CentrosPropios.Where(c => c.CentroId == ofertaConfirmada.CentroId.Value).Select(c => new { c.Centro, c.MutuaId, c.Direccion, c.Telefono }).FirstOrDefaultAsync();
            if (cpOferta != null)
            {
                centroDemanda = cpOferta.Centro; direccionCentro = cpOferta.Direccion; telefono = cpOferta.Telefono;
                mutuaOfertante = await _context.Mutuas.Where(m => m.MutuaId == cpOferta.MutuaId).Select(m => m.Mutua1).FirstOrDefaultAsync();
            }
            else
            {
                var ccOferta = await _context.CentrosConcertados.Where(c => c.CentroId == ofertaConfirmada.CentroId.Value).Select(c => new { c.Centro, c.Direccion, c.Telefono }).FirstOrDefaultAsync();
                if (ccOferta != null) { centroDemanda = ccOferta.Centro; direccionCentro = ccOferta.Direccion; telefono = ccOferta.Telefono; }
            }
        }

        var subSolicitudes = new List<SubSolicitudDemandaDTO>();
        var subs = await _context.DemandasSubSols.Where(s => s.DemandaId == id).ToListAsync();

        foreach (var sub in subs)
        {
            string? subCentro = null; string? subMutua = null;
            if (sub.CentroId.HasValue)
            {
                var cp = await _context.CentrosPropios.Where(c => c.CentroId == sub.CentroId.Value).Select(c => new { c.Centro, c.MutuaId }).FirstOrDefaultAsync();
                if (cp != null)
                {
                    subCentro = cp.Centro;
                    subMutua = await _context.Mutuas.Where(m => m.MutuaId == cp.MutuaId).Select(m => m.Mutua1).FirstOrDefaultAsync();
                }
                else
                    subCentro = await _context.CentrosConcertados.Where(c => c.CentroId == sub.CentroId.Value).Select(c => c.Centro).FirstOrDefaultAsync();
            }

            Oferta? ofertaSub = sub.OfertaId.HasValue ? await _context.Ofertas.FindAsync(sub.OfertaId.Value) : null;
            string? subEstado = sub.EstadoId.HasValue ? await _context.AuxEstadosDemanda.Where(e => e.EstadoId == sub.EstadoId.Value).Select(e => e.Estado).FirstOrDefaultAsync() : null;

            subSolicitudes.Add(new SubSolicitudDemandaDTO
            {
                SubSolId = sub.DemandasSubSolId,
                MutuaOfertante = subMutua,
                Centro = subCentro,
                Contestacion = ofertaSub?.NotaContestacion,
                ContestacionPlazos = ofertaSub?.ContestacionPlazos,
                FechaAsignacion = ofertaSub?.FechaAsignacion,
                FechaConfirmacion = ofertaSub?.FechaConfirmacion,
                Ene = ofertaSub?.Ene,
                Feb = ofertaSub?.Feb,
                Mar = ofertaSub?.Mar,
                Abr = ofertaSub?.Abr,
                May = ofertaSub?.May,
                Jun = ofertaSub?.Jun,
                Jul = ofertaSub?.Jul,
                Ago = ofertaSub?.Ago,
                Sep = ofertaSub?.Sep,
                Oct = ofertaSub?.Oct,
                Nov = ofertaSub?.Nov,
                Dic = ofertaSub?.Dic,
                Total = (ofertaSub?.Ene ?? 0) + (ofertaSub?.Feb ?? 0) + (ofertaSub?.Mar ?? 0) + (ofertaSub?.Abr ?? 0) + (ofertaSub?.May ?? 0) + (ofertaSub?.Jun ?? 0) + (ofertaSub?.Jul ?? 0) + (ofertaSub?.Ago ?? 0) + (ofertaSub?.Sep ?? 0) + (ofertaSub?.Oct ?? 0) + (ofertaSub?.Nov ?? 0) + (ofertaSub?.Dic ?? 0),
                EstadoId = sub.EstadoId,
                Estado = subEstado,
            });
        }

        var docsRaw = await _context.DemandasDocumentacions.Where(d => d.DemandaId == id).ToListAsync();
        var mutuaIds = docsRaw.Where(d => d.MutuaId.HasValue).Select(d => d.MutuaId!.Value).Distinct().ToList();
        var usuarioIds = docsRaw.Where(d => d.UsuarioAlta.HasValue).Select(d => d.UsuarioAlta!.Value).Distinct().ToList();
        var mutuasDoc = await _context.Mutuas.Where(m => mutuaIds.Contains(m.MutuaId)).ToDictionaryAsync(m => m.MutuaId, m => m.Mutua1);
        var usuariosDoc = await _context.Usuarios.Where(u => usuarioIds.Contains(u.UsuarioId)).ToDictionaryAsync(u => u.UsuarioId, u => u.Usuario1);

        var documentos = docsRaw.Select(d => new DocumentoDemandaDTO
        {
            DocumentoId = d.DocumentoId,
            NombreDocumento = d.NombreDocumento,
            Nombre = d.Nombre,
            FechaAlta = d.FechaAlta,
            Mutua = d.MutuaId.HasValue && mutuasDoc.ContainsKey(d.MutuaId.Value) ? mutuasDoc[d.MutuaId.Value] : null,
            Usuario = d.UsuarioAlta.HasValue && usuariosDoc.ContainsKey(d.UsuarioAlta.Value) ? usuariosDoc[d.UsuarioAlta.Value] : null,
        }).ToList();

        return new DemandaEditDTO
        {
            DemandaId = demanda.DemandaId,
            EstadoId = demanda.EstadoId,
            Estado = estado,
            TipoId = demanda.TipoId,
            Especialidad = especialidad,
            Servicio = servicio,
            Localidad = localidad,
            Provincia = provincia,
            MutuaSolicitante = mutuaSolicitante,
            MutuaOfertante = mutuaOfertante,
            Centro = centroDemanda,
            DireccionCentro = direccionCentro,
            Telefono = telefono,
            FechaSolicitud = demanda.FechaAlta,
            FechaConfirmacion = ofertaConfirmada?.FechaConfirmacion,
            FechaAsignacion = ofertaConfirmada?.FechaAsignacion,
            Descripcion = demanda.Descripcion,
            Plazos = demanda.Plazos,
            Ene = demanda.Ene,
            Feb = demanda.Feb,
            Mar = demanda.Mar,
            Abr = demanda.Abr,
            May = demanda.May,
            Jun = demanda.Jun,
            Jul = demanda.Jul,
            Ago = demanda.Ago,
            Sep = demanda.Sep,
            Oct = demanda.Oct,
            Nov = demanda.Nov,
            Dic = demanda.Dic,
            OfertaEne = ofertaConfirmada?.Ene,
            OfertaFeb = ofertaConfirmada?.Feb,
            OfertaMar = ofertaConfirmada?.Mar,
            OfertaAbr = ofertaConfirmada?.Abr,
            OfertaMay = ofertaConfirmada?.May,
            OfertaJun = ofertaConfirmada?.Jun,
            OfertaJul = ofertaConfirmada?.Jul,
            OfertaAgo = ofertaConfirmada?.Ago,
            OfertaSep = ofertaConfirmada?.Sep,
            OfertaOct = ofertaConfirmada?.Oct,
            OfertaNov = ofertaConfirmada?.Nov,
            OfertaDic = ofertaConfirmada?.Dic,
            SubSolicitudes = subSolicitudes,
            Documentos = documentos,
        };
    }
    public async Task<bool> GuardarDocumentoAsync(int demandaId, IFormFile fichero)
    {
        var demanda = await _context.Demandas.FindAsync(demandaId);
        if (demanda == null) return false;

        // A) Definimos la ruta física en el servidor donde se guardarán los archivos
        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath); // Crea la carpeta si no existe
        }

        // B) Creamos un nombre de archivo único para evitar que un usuario pise el archivo de otro
        var extension = Path.GetExtension(fichero.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(fichero.FileName)}{extension}";
        var filePath = Path.Combine(folderPath, uniqueFileName);

        // C) Guardamos el archivo binario en el disco duro del servidor
        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await fichero.CopyToAsync(stream);
        }

        // D) 💾 Insertamos el registro en tu tabla relacional de documentos (deducida de tu GetByIdAsync)
        var nuevaDocumentacion = new DemandasDocumentacion
        {
            DemandaId = demandaId,
            NombreDocumento = fichero.FileName,          // Nombre original (ej: "informe.pdf")
            Nombre = uniqueFileName,                     // Nombre físico real único en el disco
            FechaAlta = DateTime.Now,
            UsuarioAlta = 1,                             // ID de usuario administrador por defecto para tus pruebas
            MutuaId = demanda.MutuaDemandaId             // Vinculamos la mutua de la demanda original
        };

        _context.DemandasDocumentacions.Add(nuevaDocumentacion);
        await _context.SaveChangesAsync(); // Consolidamos los cambios físicamente en SQL Server

        return true;
    }
}