using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;

namespace MZAsistencial.Server.Services;

public interface ICitacionesService
{
    Task<object> GetSolicitadasAsync(int mutuaId, CitacionFilter filter, DataSourceLoadOptions loadOptions);
    Task<object> GetRecibidasAsync(int mutuaId, CitacionFilter filter, DataSourceLoadOptions loadOptions);
    Task<bool> UpdateEstadoAsync(int citacionId, int estadoId, string contestacion, System.Security.Claims.ClaimsPrincipal? user = null);
    Task<bool> UpdateRechazoAsync(int citacionId, string motivo, int estadoId = 6, System.Security.Claims.ClaimsPrincipal? user = null);
    Task<int> SeedDataAsync(int mutuaId);
    Task<bool> CreateSolicitudAsync(int mutuaId, CitacionDTO dto, System.Security.Claims.ClaimsPrincipal? user = null);
    Task<List<CitacionDocumentacion>> GetDocumentosAsync(int citacionId);
    Task<CitacionDocumentacion?> GetDocumentoByIdAsync(long docId);
    Task<CitacionDocumentacion> UploadDocumentoAsync(int citacionId, string nombreOriginal, string rutaFisica, int mutuaId, int usuarioAltaId);
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

    public async Task<object> GetSolicitadasAsync(int mutuaId, CitacionFilter filter, DataSourceLoadOptions loadOptions)
    {
        try
        {
            var query = _context.VwCitaciones
                .Where(c => c.MutuaDemandanteId == mutuaId);

            var finalQuery = ApplyFiltersAndSelect(query, filter);
            return await DataSourceLoader.LoadAsync(finalQuery, loadOptions);
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<object> GetRecibidasAsync(int mutuaId, CitacionFilter filter, DataSourceLoadOptions loadOptions)
    {
        try
        {
            var query = _context.VwCitaciones
                .Where(c => c.MutuaOfertanteId == mutuaId);

            var finalQuery = ApplyFiltersAndSelect(query, filter);
            return await DataSourceLoader.LoadAsync(finalQuery, loadOptions);
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    private IQueryable<CitacionDTO> ApplyFiltersAndSelect(IQueryable<VwCitacione> query, CitacionFilter filter)
    {
        // 1. Join con Demandas para cálculos de consumo
        var joinedQuery = from c in query
                          join d in _context.Demandas on c.Id equals d.DemandaId into demandGroup
                          from d in demandGroup.DefaultIfEmpty()
                          select new { c, d };

        // 2. Filtros básicos
        if (filter.Anio.HasValue)
            joinedQuery = joinedQuery.Where(x => x.c.Año == filter.Anio);
        
        if (filter.CitacionId.HasValue)
            joinedQuery = joinedQuery.Where(x => x.c.CitacionId == filter.CitacionId);

        if (filter.DemandaId.HasValue)
            joinedQuery = joinedQuery.Where(x => x.c.Id == filter.DemandaId);

        if (!string.IsNullOrEmpty(filter.Necesidad))
            joinedQuery = joinedQuery.Where(x => x.c.Necesidad != null && x.c.Necesidad.Contains(filter.Necesidad));

        // 3. Lógica de Estados (incluyendo virtuales)
        if (!string.IsNullOrEmpty(filter.Estado) && filter.Estado != "Todas")
        {
            var now = DateTime.Now;
            switch (filter.Estado)
            {
                case "Desierta":
                    joinedQuery = joinedQuery.Where(x => x.c.FechaRespuestaCitacion == null && 
                                                      x.c.FechaAltaSolicitud <= now.AddHours(-96));
                    break;
                case "Caducadas":
                    joinedQuery = joinedQuery.Where(x => x.c.FechaRespuestaCitacion == null && 
                                                      x.d != null && x.d.FechaAlta <= now.AddMonths(-1));
                    break;
                case "Pendiente Consumir":
                    joinedQuery = joinedQuery.Where(x => x.d != null && (
                        (x.d.Ene ?? 0) > (x.c.Ene ?? 0) ||
                        (x.d.Feb ?? 0) > (x.c.Feb ?? 0) ||
                        (x.d.Mar ?? 0) > (x.c.Mar ?? 0) ||
                        (x.d.Abr ?? 0) > (x.c.Abr ?? 0) ||
                        (x.d.May ?? 0) > (x.c.May ?? 0) ||
                        (x.d.Jun ?? 0) > (x.c.Jun ?? 0) ||
                        (x.d.Jul ?? 0) > (x.c.Jul ?? 0) ||
                        (x.d.Ago ?? 0) > (x.c.Ago ?? 0) ||
                        (x.d.Sep ?? 0) > (x.c.Sep ?? 0) ||
                        (x.d.Oct ?? 0) > (x.c.Oct ?? 0) ||
                        (x.d.Nov ?? 0) > (x.c.Nov ?? 0) ||
                        (x.d.Dic ?? 0) > (x.c.Diciembre ?? 0)
                    ));
                    break;
                case "Consumidas":
                    joinedQuery = joinedQuery.Where(x => x.d != null && 
                        (x.c.Ene ?? 0) >= (x.d.Ene ?? 0) &&
                        (x.c.Feb ?? 0) >= (x.d.Feb ?? 0) &&
                        (x.c.Mar ?? 0) >= (x.d.Mar ?? 0) &&
                        (x.c.Abr ?? 0) >= (x.d.Abr ?? 0) &&
                        (x.c.May ?? 0) >= (x.d.May ?? 0) &&
                        (x.c.Jun ?? 0) >= (x.d.Jun ?? 0) &&
                        (x.c.Jul ?? 0) >= (x.d.Jul ?? 0) &&
                        (x.c.Ago ?? 0) >= (x.d.Ago ?? 0) &&
                        (x.c.Sep ?? 0) >= (x.d.Sep ?? 0) &&
                        (x.c.Oct ?? 0) >= (x.d.Oct ?? 0) &&
                        (x.c.Nov ?? 0) >= (x.d.Nov ?? 0) &&
                        (x.c.Diciembre ?? 0) >= (x.d.Dic ?? 0)
                    );
                    break;
                default:
                    joinedQuery = joinedQuery.Where(x => x.c.Estado == filter.Estado);
                    break;
            }
        }

        return joinedQuery
            .Select(x => new CitacionDTO
            {
                CitacionId = x.c.CitacionId,
                DemandaId = x.c.Id,
                Anio = x.c.Año,
                MutuaOfertante = x.c.MutuaOfertante,
                MutuaSolicitante = x.c.MutuaSolicitante,
                Centro = x.c.Centro,
                Especialidad = x.c.Especialidad,
                Servicio = x.c.Servicio,
                Estado = x.c.Estado,
                Ene = x.c.Ene,
                Feb = x.c.Feb,
                Mar = x.c.Mar,
                Abr = x.c.Abr,
                May = x.c.May,
                Jun = x.c.Jun,
                Jul = x.c.Jul,
                Ago = x.c.Ago,
                Sep = x.c.Sep,
                Oct = x.c.Oct,
                Nov = x.c.Nov,
                Diciembre = x.c.Diciembre,
                Total = x.c.Total,
                FechaAltaSolicitud = x.c.FechaAltaSolicitud,
                EstadoId = x.c.EstadoId,
                MutuaOfertanteId = x.c.MutuaOfertanteId,
                MutuaDemandanteId = x.c.MutuaDemandanteId,
                Provincia = x.c.Provincia,
                Localidad = x.c.Localidad,
                TipoMovimiento = x.c.TipoMovimiento
            });
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
            return true;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Citaciones");
            throw;
        }
    }

    public async Task<bool> UpdateRechazoAsync(int citacionId, string motivo, int estadoId = 6, System.Security.Claims.ClaimsPrincipal? user = null)
    {
        try
        {
            var citacion = await _context.Citaciones.FindAsync(citacionId);
            if (citacion == null) return false;

            bool eraConfirmada = citacion.EstadoId == 2;

            citacion.EstadoId = estadoId;
            citacion.MotivoRechazo = motivo;
            citacion.FechaRechazo = DateTime.Now;
            citacion.FechaRespuestaCitacion = DateTime.Now;

            await _context.SaveChangesAsync();
            
            if (eraConfirmada)
            {
                // TODO: Integrar con EmailService cuando esté disponible
                Console.WriteLine($"[EMAIL ALERT MOCK] Enviando alerta de cancelación. Citación {citacionId} rechazada. Motivo: {motivo}");
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
                EspecialidadId = dto.EspecialidadId,
                ServicioId = (int?)(dto.ServicioId),
                ProvinciaId = dto.ProvinciaId,
                Localidad = dto.LocalidadId,
                MovimientoId = dto.TipoMovimientoId, // added field mapped to Aux_Citacion_Movimientos
                Necesidad = dto.Necesidad,
                EstadoId = 1, // Pendiente
                FechaAltaSolicitud = DateTime.Now,
                FechaAlta = DateTime.Now,
                UsuarioAltaId = 1, // Default admin
                Ene = dto.Ene ?? 0,
                Feb = dto.Feb ?? 0,
                Mar = dto.Mar ?? 0,
                Abr = dto.Abr ?? 0,
                May = dto.May ?? 0,
                Jun = dto.Jun ?? 0,
                Jul = dto.Jul ?? 0,
                Ago = dto.Ago ?? 0,
                Sep = dto.Sep ?? 0,
                Oct = dto.Oct ?? 0,
                Nov = dto.Nov ?? 0,
                Diciembre = dto.Diciembre ?? 0,
                Total = dto.Total ?? 0
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
        return await _context.CitacionDocumentacions
            .Where(d => d.CitacionId == citacionId)
            .OrderByDescending(d => d.FechaAlta)
            .ToListAsync();
    }

    public async Task<CitacionDocumentacion?> GetDocumentoByIdAsync(long docId)
    {
        return await _context.CitacionDocumentacions.FindAsync(docId);
    }

    public async Task<CitacionDocumentacion> UploadDocumentoAsync(int citacionId, string nombreOriginal, string rutaFisica, int mutuaId, int usuarioAltaId)
    {
        var doc = new CitacionDocumentacion
        {
            CitacionId = citacionId,
            Nombre = nombreOriginal,
            NombreFisicoServidor = rutaFisica,
            MutuaId = mutuaId,
            UsuarioAlta = usuarioAltaId,
            FechaAlta = System.DateTime.Now
        };

        _context.CitacionDocumentacions.Add(doc);
        await _context.SaveChangesAsync();

        return doc;
    }
}
