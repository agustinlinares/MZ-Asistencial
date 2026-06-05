using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services;

public interface ICitacionesService
{
    Task<List<CitacionDTO>> GetSolicitadasAsync(int mutuaId, CitacionFilter filter);
    Task<List<CitacionDTO>> GetRecibidasAsync(int mutuaId, CitacionFilter filter);
    Task<bool> UpdateEstadoAsync(int citacionId, int estadoId, string contestacion, System.Security.Claims.ClaimsPrincipal? user = null);
    Task<bool> UpdateRechazoAsync(int citacionId, string motivo, System.Security.Claims.ClaimsPrincipal? user = null);
    Task<int> SeedDataAsync(int mutuaId);
    Task<bool> CreateSolicitudAsync(int mutuaId, CitacionDTO dto, System.Security.Claims.ClaimsPrincipal? user = null);
    Task<List<CitacionDocumentacion>> GetDocumentosAsync(int citacionId);
    Task<CitacionDocumentacion?> GetDocumentoByIdAsync(int docId);
    Task<bool> UploadDocumentoAsync(int citacionId, string nombreArchivo, string rutaFisica, int mutuaId, int usuarioId);
    Task<List<RegistroActividad>> GetHistorialAsync(int citacionId);
    Task<bool> UpdateEstadoMasivoAsync(List<int> citacionIds, int estadoId, string contestacion, System.Security.Claims.ClaimsPrincipal? user = null);
    Task<bool> UpdateRechazoMasivoAsync(List<int> citacionIds, string motivo, System.Security.Claims.ClaimsPrincipal? user = null);
}

public class CitacionFilter
{
    public int? Anio { get; set; }
    public string? Estado { get; set; }
    public int? CitacionId { get; set; }
    public int? DemandaId { get; set; }
    public string? Necesidad { get; set; }
    public bool Agrupada { get; set; }
}

public class CitacionesService : ICitacionesService
{
    private readonly MZAsistencialContext _context;
    private readonly IRegistroErroresService _registroErroresService;

    public CitacionesService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
    {
        _context = context;
        _registroErroresService = registroErroresService;
    }

    public async Task<List<CitacionDTO>> GetSolicitadasAsync(int mutuaId, CitacionFilter filter)
    {
        try
        {
            var query = _context.VwCitaciones
                .Where(c => c.MutuaDemandanteId == mutuaId);

            return await ApplyFiltersAndSelect(query, filter);
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<List<CitacionDTO>> GetRecibidasAsync(int mutuaId, CitacionFilter filter)
    {
        try
        {
            var query = _context.VwCitaciones
                .Where(c => c.MutuaOfertanteId == mutuaId);

            return await ApplyFiltersAndSelect(query, filter);
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    private async Task<List<CitacionDTO>> ApplyFiltersAndSelect(IQueryable<VwCitacione> query, CitacionFilter filter)
    {
        // First we filter the base citations as requested
        if (filter.Anio.HasValue) query = query.Where(c => c.Año == filter.Anio);
        if (filter.CitacionId.HasValue) query = query.Where(c => c.CitacionId == filter.CitacionId);
        if (filter.DemandaId.HasValue) query = query.Where(c => c.Id == filter.DemandaId);
        if (!string.IsNullOrEmpty(filter.Necesidad)) query = query.Where(c => c.Necesidad.Contains(filter.Necesidad));

        // We fetch the citations in memory (or minimal projection) to compute the complex grouping because 
        // full dynamic grouping with left joins on Views in EF can throw translation exceptions.
        var baseCitations = await query.ToListAsync();
        if (!baseCitations.Any()) return new List<CitacionDTO>();

        var demandaIds = baseCitations.Select(c => c.Id).Distinct().ToList();
        
        // Fetch related Demands
        var demandas = await _context.Demandas.Where(d => demandaIds.Contains(d.DemandaId)).ToDictionaryAsync(d => d.DemandaId);

        // Fetch all Citations for these Demands to calculate accurate Consumption
        // State 6 = Rechazada. We do not count them as consumption.
        var siblingCitations = await _context.Citaciones
            .Where(c => c.DemandaId != null && demandaIds.Contains(c.DemandaId.Value) && c.EstadoId != 6)
            .ToListAsync();

        var consumptionMap = siblingCitations
            .GroupBy(c => c.DemandaId)
            .ToDictionary(g => g.Key, g => new {
                Ene = g.Sum(x => x.Ene ?? 0),
                Feb = g.Sum(x => x.Feb ?? 0),
                Mar = g.Sum(x => x.Mar ?? 0),
                Abr = g.Sum(x => x.Abr ?? 0),
                May = g.Sum(x => x.May ?? 0),
                Jun = g.Sum(x => x.Jun ?? 0),
                Jul = g.Sum(x => x.Jul ?? 0),
                Ago = g.Sum(x => x.Ago ?? 0),
                Sep = g.Sum(x => x.Sep ?? 0),
                Oct = g.Sum(x => x.Oct ?? 0),
                Nov = g.Sum(x => x.Nov ?? 0),
                Dic = g.Sum(x => x.Diciembre ?? 0)
            });

        var results = new List<CitacionDTO>();
        var now = DateTime.Now;

        foreach (var c in baseCitations)
        {
            var d = c.Id.HasValue && demandas.ContainsKey(c.Id.Value) ? demandas[c.Id.Value] : null;
            var cons = c.Id.HasValue && consumptionMap.ContainsKey(c.Id.Value) ? consumptionMap[c.Id.Value] : null;

            bool isDesierta = c.FechaRespuestaCitacion == null && c.FechaAltaSolicitud <= now.AddHours(-96);
            bool isCaducada = c.FechaRespuestaCitacion == null && d != null && d.FechaAlta <= now.AddMonths(-1);
            
            bool isPendienteConsumir = false;
            bool isConsumido = false;

            if (d != null)
            {
                var dTotal = (d.Ene ?? 0) + (d.Feb ?? 0) + (d.Mar ?? 0) + (d.Abr ?? 0) + (d.May ?? 0) + (d.Jun ?? 0) + 
                             (d.Jul ?? 0) + (d.Ago ?? 0) + (d.Sep ?? 0) + (d.Oct ?? 0) + (d.Nov ?? 0) + (d.Dic ?? 0);
                
                var cTotal = cons != null ? (cons.Ene + cons.Feb + cons.Mar + cons.Abr + cons.May + cons.Jun + 
                                             cons.Jul + cons.Ago + cons.Sep + cons.Oct + cons.Nov + cons.Dic) : 0;
                
                // For Pendiente Consumir: The demand has more remaining capacity in any month
                isPendienteConsumir = (d.Ene ?? 0) > (cons?.Ene ?? 0) || (d.Feb ?? 0) > (cons?.Feb ?? 0) || 
                                      (d.Mar ?? 0) > (cons?.Mar ?? 0) || (d.Abr ?? 0) > (cons?.Abr ?? 0) ||
                                      (d.May ?? 0) > (cons?.May ?? 0) || (d.Jun ?? 0) > (cons?.Jun ?? 0) ||
                                      (d.Jul ?? 0) > (cons?.Jul ?? 0) || (d.Ago ?? 0) > (cons?.Ago ?? 0) ||
                                      (d.Sep ?? 0) > (cons?.Sep ?? 0) || (d.Oct ?? 0) > (cons?.Oct ?? 0) ||
                                      (d.Nov ?? 0) > (cons?.Nov ?? 0) || (d.Dic ?? 0) > (cons?.Dic ?? 0);

                // For Consumido: The consumption equals or exceeds the demand in all months where demand existed
                // Simplified: total consumed >= total demand and no month is pending.
                isConsumido = !isPendienteConsumir && dTotal > 0 && cTotal >= dTotal;
            }

            // Apply Derived State Filters
            if (!string.IsNullOrEmpty(filter.Estado) && filter.Estado != "Todas")
            {
                if (filter.Estado == "Desierta" && !isDesierta) continue;
                if (filter.Estado == "Caducadas" && !isCaducada) continue;
                if (filter.Estado == "Pendiente Consumir" && !isPendienteConsumir) continue;
                if (filter.Estado == "Consumidas" && !isConsumido) continue;
                if (filter.Estado != "Desierta" && filter.Estado != "Caducadas" && 
                    filter.Estado != "Pendiente Consumir" && filter.Estado != "Consumidas" &&
                    c.Estado != filter.Estado) 
                {
                    continue;
                }
            }

            results.Add(new CitacionDTO
            {
                CitacionId = c.CitacionId,
                DemandaId = c.Id,
                Anio = c.Año,
                MutuaOfertante = c.MutuaOfertante,
                MutuaSolicitante = c.MutuaSolicitante,
                Centro = c.Centro,
                Especialidad = c.Especialidad,
                Servicio = c.Servicio,
                // Assigning derived states for UI
                Estado = isDesierta ? "Desierta" : (isCaducada ? "Caducada" : c.Estado),
                Ene = c.Ene, Feb = c.Feb, Mar = c.Mar, Abr = c.Abr, May = c.May, Jun = c.Jun,
                Jul = c.Jul, Ago = c.Ago, Sep = c.Sep, Oct = c.Oct, Nov = c.Nov, Diciembre = c.Diciembre,
                Total = c.Total,
                FechaAltaSolicitud = c.FechaAltaSolicitud,
                EstadoId = c.EstadoId,
                MutuaOfertanteId = c.MutuaOfertanteId,
                MutuaDemandanteId = c.MutuaDemandanteId,
                Necesidad = c.Necesidad,
                Provincia = c.Provincia,
                Localidad = c.Localidad,
                Direccion = c.DireccionGis,
                Telefono = c.Telefono,
                Contestacion = c.Contestacion,
                FechaContestacion = c.FechaRespuestaCitacion,
                DemandaEne = d?.Ene ?? 0, DemandaFeb = d?.Feb ?? 0, DemandaMar = d?.Mar ?? 0, DemandaAbr = d?.Abr ?? 0,
                DemandaMay = d?.May ?? 0, DemandaJun = d?.Jun ?? 0, DemandaJul = d?.Jul ?? 0, DemandaAgo = d?.Ago ?? 0,
                DemandaSep = d?.Sep ?? 0, DemandaOct = d?.Oct ?? 0, DemandaNov = d?.Nov ?? 0, DemandaDic = d?.Dic ?? 0,
                DemandaTotal = d != null ? ((d.Ene ?? 0) + (d.Feb ?? 0) + (d.Mar ?? 0) + (d.Abr ?? 0) + (d.May ?? 0) + (d.Jun ?? 0) + (d.Jul ?? 0) + (d.Ago ?? 0) + (d.Sep ?? 0) + (d.Oct ?? 0) + (d.Nov ?? 0) + (d.Dic ?? 0)) : 0,
                ConsumoEne = cons?.Ene ?? 0, ConsumoFeb = cons?.Feb ?? 0, ConsumoMar = cons?.Mar ?? 0, ConsumoAbr = cons?.Abr ?? 0,
                ConsumoMay = cons?.May ?? 0, ConsumoJun = cons?.Jun ?? 0, ConsumoJul = cons?.Jul ?? 0, ConsumoAgo = cons?.Ago ?? 0,
                ConsumoSep = cons?.Sep ?? 0, ConsumoOct = cons?.Oct ?? 0, ConsumoNov = cons?.Nov ?? 0, ConsumoDic = cons?.Dic ?? 0,
                ConsumoTotal = cons != null ? (cons.Ene + cons.Feb + cons.Mar + cons.Abr + cons.May + cons.Jun + cons.Jul + cons.Ago + cons.Sep + cons.Oct + cons.Nov + cons.Dic) : 0
            });
        }

        return results.OrderByDescending(r => r.FechaAltaSolicitud).ToList();
    }

    public async Task<bool> UpdateEstadoAsync(int citacionId, int estadoId, string contestacion, System.Security.Claims.ClaimsPrincipal? user = null)
    {
        try
        {
            var citacion = await _context.Citaciones.FindAsync(citacionId);
            if (citacion == null) return false;

            citacion.EstadoId = estadoId;
            citacion.Contestacion = contestacion;
            citacion.FechaRespuestaCitacion = DateTime.Now;

            await _context.SaveChangesAsync();
            await RegistrarActividadAsync(citacionId, $"Estado cambiado a {(estadoId == 2 ? "Concedida" : "Modificada")}. Contestación: {contestacion}", 1);
            return true;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<bool> UpdateRechazoAsync(int citacionId, string motivo, System.Security.Claims.ClaimsPrincipal? user = null)
    {
        try
        {
            var citacion = await _context.Citaciones.FindAsync(citacionId);
            if (citacion == null) return false;

            citacion.EstadoId = 6; // Hardcoded state 6 for Rechazo as per legacy logic
            citacion.MotivoRechazo = motivo;
            citacion.FechaRechazo = DateTime.Now;
            citacion.FechaRespuestaCitacion = DateTime.Now;

            await _context.SaveChangesAsync();
            await RegistrarActividadAsync(citacionId, $"Citación Rechazada. Motivo: {motivo}", 1);
            return true;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<bool> UpdateEstadoMasivoAsync(List<int> citacionIds, int estadoId, string contestacion, System.Security.Claims.ClaimsPrincipal? user = null)
    {
        try
        {
            foreach (var id in citacionIds)
            {
                await UpdateEstadoAsync(id, estadoId, contestacion, user);
            }
            return true;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<bool> UpdateRechazoMasivoAsync(List<int> citacionIds, string motivo, System.Security.Claims.ClaimsPrincipal? user = null)
    {
        try
        {
            foreach (var id in citacionIds)
            {
                await UpdateRechazoAsync(id, motivo, user);
            }
            return true;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }
    public async Task<bool> CreateSolicitudAsync(int mutuaId, CitacionDTO dto, System.Security.Claims.ClaimsPrincipal? user = null)
    {
        try
        {
            // Validación de existencia de la mutua
            var mutuaExiste = await _context.Mutuas.AnyAsync(m => m.MutuaId == mutuaId);
            if (!mutuaExiste) return false;

            var citacion = new Citacione
            {
                Año = dto.Anio ?? DateTime.Now.Year,
                MutuaDemandante = mutuaId,
                MutaOferta = dto.MutuaOfertanteId ?? 0,
                CentroId = dto.CentroId ?? 0,
                Necesidad = dto.Necesidad,
                EstadoId = 1, // Pendiente
                FechaAltaSolicitud = DateTime.Now,
                FechaAlta = DateTime.Now,
                UsuarioAltaId = 1 // Default admin
            };

            _context.Citaciones.Add(citacion);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<int> SeedDataAsync(int mutuaId)
    {
        try
        {
            // 1. Crear una Demanda base
            var demanda = new Demanda
            {
                Año = 2026,
                MutuaDemandaId = mutuaId,
                Ene = 10, Feb = 10, Mar = 10, Abr = 10, May = 10, Jun = 10,
                Jul = 10, Ago = 10, Sep = 10, Oct = 10, Nov = 10, Dic = 10,
                EstadoId = 1,
                FechaAlta = DateTime.Now.AddDays(-10),
                Descripcion = "Demanda de prueba para Seed",
                UsuarioAltaId = 1
            };
            _context.Demandas.Add(demanda);
            await _context.SaveChangesAsync();

            // 2. Crear Citaciones vinculadas
            var citaciones = new List<Citacione>
            {
                // Caso 1: Pendiente de conceder
                new Citacione {
                    DemandaId = demanda.DemandaId, Año = 2026, MutuaDemandante = mutuaId, MutaOferta = 2,
                    Ene = 2, Feb = 2, Mar = 2, Total = 6, EstadoId = 1,
                    FechaAltaSolicitud = DateTime.Now.AddDays(-2),
                    Necesidad = "Urgencia dental"
                },
                // Caso 2: Consumida (igual a demanda)
                new Citacione {
                    DemandaId = demanda.DemandaId, Año = 2026, MutuaDemandante = mutuaId, MutaOferta = 2,
                    Ene = 10, Feb = 10, Mar = 10, Abr = 10, May = 10, Jun = 10,
                    Jul = 10, Ago = 10, Sep = 10, Oct = 10, Nov = 10, Diciembre = 10, 
                    Total = 120, EstadoId = 2,
                    FechaAltaSolicitud = DateTime.Now.AddDays(-30),
                    FechaRespuestaCitacion = DateTime.Now.AddDays(-29),
                    Necesidad = "Consumo total de reserva"
                },
                // Caso 3: Desierta (antigua sin respuesta)
                new Citacione {
                    DemandaId = demanda.DemandaId, Año = 2026, MutuaDemandante = mutuaId, MutaOferta = 3,
                    Ene = 1, Feb = 1, Total = 2, EstadoId = 1,
                    FechaAltaSolicitud = DateTime.Now.AddDays(-5), // > 96h
                    Necesidad = "Solicitud olvidada"
                },
                // Caso 4: Rechazada
                new Citacione {
                    DemandaId = demanda.DemandaId, Año = 2026, MutuaDemandante = mutuaId, MutaOferta = 2,
                    Ene = 5, Total = 5, EstadoId = 6,
                    FechaAltaSolicitud = DateTime.Now.AddDays(-1),
                    FechaRespuestaCitacion = DateTime.Now.AddHours(-2),
                    MotivoRechazo = "Falta de personal en el centro",
                    Necesidad = "Consulta traumatología"
                }
            };

            _context.Citaciones.AddRange(citaciones);
            await _context.SaveChangesAsync();

            return citaciones.Count;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<List<CitacionDocumentacion>> GetDocumentosAsync(int citacionId)
    {
        try
        {
            return await _context.CitacionDocumentacions
                .Where(d => d.CitacionId == citacionId)
                .OrderByDescending(d => d.FechaAlta)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<CitacionDocumentacion?> GetDocumentoByIdAsync(int docId)
    {
        return await _context.CitacionDocumentacions.FindAsync(docId);
    }

    public async Task<bool> UploadDocumentoAsync(int citacionId, string nombreArchivo, string rutaFisica, int mutuaId, int usuarioId)
    {
        try
        {
            var doc = new CitacionDocumentacion
            {
                CitacionId = citacionId,
                Nombre = nombreArchivo,
                NombreFisicoServidor = rutaFisica,
                MutuaId = mutuaId,
                UsuarioAlta = usuarioId,
                FechaAlta = DateTime.Now
            };

            _context.CitacionDocumentacions.Add(doc);
            await _context.SaveChangesAsync();
            await RegistrarActividadAsync(citacionId, $"Documento subido: {nombreArchivo}", usuarioId);
            return true;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<List<RegistroActividad>> GetHistorialAsync(int citacionId)
    {
        try
        {
            return await _context.RegistroActividads
                .Where(r => r.Accion != null && r.Accion.Contains($"Citación {citacionId} -"))
                .OrderByDescending(r => r.Fecha)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    private async Task RegistrarActividadAsync(int citacionId, string accion, int usuarioId)
    {
        try
        {
            var registro = new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha = DateTime.Now,
                Accion = $"Citación {citacionId} - {accion}",
                Sql = "N/A"
            };
            _context.RegistroActividads.Add(registro);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
        }
    }
}
