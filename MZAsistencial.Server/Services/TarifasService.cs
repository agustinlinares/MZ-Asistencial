using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services;

public interface ITarifasService
{
    Task<List<TarifaListDTO>> GetAllAsync();
    Task<TarifaFichaDTO?> GetByIdAsync(int id);
    Task<int> CreateAsync(TarifaFichaDTO dto);
    Task<bool> UpdateAsync(int id, TarifaFichaDTO dto);
    Task<bool> DeleteAsync(int id);
    Task<List<AuxEspecialidadDTO>> GetEspecialidadesAsync();
    Task<List<AuxCiepDTO>> GetCiepByEspecialidadAsync(int especialidadId);
    Task<TarifaFichaDTO?> CopiarTarifaAsync(CopiarTarifaRequestDTO request);
}

public class TarifasService : ITarifasService
{
    private readonly MZAsistencialContext _context;

    public TarifasService(MZAsistencialContext context)
    {
        _context = context;
    }

    public async Task<List<TarifaListDTO>> GetAllAsync()
    {
        return await _context.Tarifas
            .OrderByDescending(t => t.Año)
            .ThenByDescending(t => t.TarifaId)
            .Select(t => new TarifaListDTO
            {
                TarifaId = t.TarifaId,
                Tarifa = t.Tarifa1,
                Año = t.Año,
                Porcentaje = t.Porcentaje,
                Activo = t.Activo == 1
            })
            .ToListAsync();
    }

    public async Task<TarifaFichaDTO?> GetByIdAsync(int id)
    {
        var tarifa = await _context.Tarifas.FindAsync(id);
        if (tarifa == null) return null;

        var detalles = await (
            from d in _context.TarifasDetalles
            join e in _context.AuxEspecialidades on d.EspecialidadId equals e.EspecialidadId into espJoin
            from e in espJoin.DefaultIfEmpty()
            join c in _context.CodigosCieps on d.CiepId equals c.CiepId into ciepJoin
            from c in ciepJoin.DefaultIfEmpty()
            where d.TarifaId == id
            orderby d.Servicio
            select new TarifaDetalleDTO
            {
                TarifaDetalleId = d.TarifaDetalleId,
                TarifaId = d.TarifaId,
                Servicio = d.Servicio,
                Importe = d.Importe,
                EspecialidadId = d.EspecialidadId,
                Especialidad = e != null ? e.Especialidad : null,
                CiepId = d.CiepId,
                Ciep = c != null ? c.Ciep : (d.CiepId == null ? "No Consta" : null),
                Observaciones = d.Observaciones,
                ServicioId = d.ServicioId,
                AltaTec = d.AltaTec
            }
        ).ToListAsync();

        foreach (var d in detalles.Where(x => string.IsNullOrEmpty(x.Ciep)))
            d.Ciep = "No Consta";

        return new TarifaFichaDTO
        {
            TarifaId = tarifa.TarifaId,
            Descripcion = tarifa.Tarifa1,
            Año = tarifa.Año,
            Porcentaje = tarifa.Porcentaje,
            Activo = tarifa.Activo == 1,
            Detalles = detalles
        };
    }

    public async Task<int> CreateAsync(TarifaFichaDTO dto)
    {
        var tarifa = new Tarifa
        {
            Tarifa1 = dto.Descripcion.Trim(),
            Año = dto.Año.Trim(),
            Porcentaje = dto.Porcentaje ?? 0,
            Activo = dto.Activo ? 1 : 0
        };

        _context.Tarifas.Add(tarifa);
        await _context.SaveChangesAsync();

        await SyncDetallesAsync(tarifa.TarifaId, dto.Detalles);
        return tarifa.TarifaId;
    }

    public async Task<bool> UpdateAsync(int id, TarifaFichaDTO dto)
    {
        var tarifa = await _context.Tarifas.FindAsync(id);
        if (tarifa == null) return false;

        tarifa.Tarifa1 = dto.Descripcion.Trim();
        tarifa.Año = dto.Año.Trim();
        tarifa.Porcentaje = dto.Porcentaje ?? 0;
        tarifa.Activo = dto.Activo ? 1 : 0;

        await SyncDetallesAsync(id, dto.Detalles);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var tarifa = await _context.Tarifas
            .Include(t => t.TarifasDetalles)
            .FirstOrDefaultAsync(t => t.TarifaId == id);

        if (tarifa == null) return false;

        _context.TarifasDetalles.RemoveRange(tarifa.TarifasDetalles);
        _context.Tarifas.Remove(tarifa);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<AuxEspecialidadDTO>> GetEspecialidadesAsync()
    {
        return await _context.AuxEspecialidades
            .OrderBy(e => e.Especialidad)
            .Select(e => new AuxEspecialidadDTO
            {
                EspecialidadId = e.EspecialidadId,
                Especialidad = e.Especialidad ?? ""
            })
            .ToListAsync();
    }

    public async Task<List<AuxCiepDTO>> GetCiepByEspecialidadAsync(int especialidadId)
    {
        var list = await _context.CodigosCieps
            .Where(c => c.EspecialidadId == especialidadId)
            .OrderBy(c => c.Ciep)
            .Select(c => new AuxCiepDTO { CiepId = c.CiepId, Ciep = c.Ciep })
            .ToListAsync();

        list.Insert(0, new AuxCiepDTO { CiepId = null, Ciep = "No Consta" });
        return list;
    }

    public async Task<TarifaFichaDTO?> CopiarTarifaAsync(CopiarTarifaRequestDTO request)
    {
        var origen = await GetByIdAsync(request.TarifaOrigenId);
        if (origen == null) return null;

        var nuevoAño = request.NuevoAño.Trim();
        var factor = request.AjustePorcentaje.HasValue ? 1 + request.AjustePorcentaje.Value / 100.0 : 1.0;

        var copia = new TarifaFichaDTO
        {
            TarifaId = 0,
            Descripcion = string.IsNullOrWhiteSpace(request.NuevaDescripcion)
                ? $"{origen.Descripcion} (copia {nuevoAño})"
                : request.NuevaDescripcion.Trim(),
            Año = nuevoAño,
            Porcentaje = origen.Porcentaje,
            Activo = origen.Activo,
            Detalles = origen.Detalles.Select(d => new TarifaDetalleDTO
            {
                TarifaDetalleId = 0,
                TarifaId = 0,
                Servicio = d.Servicio,
                Importe = d.Importe.HasValue ? Math.Round(d.Importe.Value * factor, 2) : null,
                EspecialidadId = d.EspecialidadId,
                Especialidad = d.Especialidad,
                CiepId = d.CiepId,
                Ciep = d.Ciep ?? "No Consta",
                Observaciones = d.Observaciones,
                ServicioId = d.ServicioId,
                AltaTec = d.AltaTec
            }).ToList()
        };

        return copia;
    }

    private async Task SyncDetallesAsync(int tarifaId, List<TarifaDetalleDTO> detalles)
    {
        var existentes = await _context.TarifasDetalles
            .Where(d => d.TarifaId == tarifaId)
            .ToListAsync();

        var idsPayload = detalles
            .Where(d => d.TarifaDetalleId > 0)
            .Select(d => d.TarifaDetalleId)
            .ToHashSet();

        foreach (var existente in existentes.Where(e => !idsPayload.Contains(e.TarifaDetalleId)))
            _context.TarifasDetalles.Remove(existente);

        foreach (var dto in detalles)
        {
            if (string.IsNullOrWhiteSpace(dto.Servicio) && dto.Importe == null && dto.EspecialidadId == null)
                continue;

            if (dto.TarifaDetalleId > 0)
            {
                var entity = existentes.FirstOrDefault(e => e.TarifaDetalleId == dto.TarifaDetalleId);
                if (entity == null) continue;
                MapDetalle(entity, dto, tarifaId);
            }
            else
            {
                var entity = new TarifasDetalle { TarifaId = tarifaId };
                MapDetalle(entity, dto, tarifaId);
                _context.TarifasDetalles.Add(entity);
            }
        }

        await _context.SaveChangesAsync();
    }

    private static void MapDetalle(TarifasDetalle entity, TarifaDetalleDTO dto, int tarifaId)
    {
        entity.TarifaId = tarifaId;
        entity.Servicio = dto.Servicio?.Trim();
        entity.Importe = dto.Importe;
        entity.EspecialidadId = dto.EspecialidadId;
        entity.CiepId = dto.CiepId is > 0 ? dto.CiepId : null;
        entity.Observaciones = dto.Observaciones?.Trim();
        entity.ServicioId = dto.ServicioId;
        entity.AltaTec = dto.AltaTec;
    }
}
