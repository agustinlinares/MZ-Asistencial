using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Services;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
namespace MZAsistencial.Server.Services;
public class Icg06EspecialidadService
{
    private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;
    public Icg06EspecialidadService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
    {
            _context = context;
            _registroErroresService = registroErroresService;
        }
    public async Task<List<Icg06EspecialidadDTO>> GetByCentroYAñoAsync(int centroId, int año)
    {
        return await _context.CentrosPropiosEspecialidades
            .Where(e => e.CentroId == centroId && e.Año == año)
            .OrderBy(e => e.EspecialidadId)
            .ThenBy(e => e.Servicio)
            .Select(e => new Icg06EspecialidadDTO
            {
                Id             = e.CentroPropioEspecialidadId,
                CentroId       = e.CentroId,
                Año            = e.Año,
                EspecialidadId = e.EspecialidadId,
                Servicio       = e.Servicio,
                Cantidad       = e.Cantidad,
                ImporteConIva  = e.ImporteConIva,
                FechaAlta      = e.FechaAlta,
                Disponibilidad = e.Disponibilidad,
            })
            .ToListAsync();
    }
    public async Task<Icg06EspecialidadDTO> CreateAsync(Icg06EspecialidadDTO dto)
    {
        var entity = new CentrosPropiosEspecialidade
        {
            CentroId       = dto.CentroId,
            Año            = dto.Año,
            EspecialidadId = dto.EspecialidadId,
            Servicio       = dto.Servicio ?? "",
            Cantidad       = dto.Cantidad,
            ImporteConIva  = dto.ImporteConIva,
            FechaAlta      = dto.FechaAlta ?? DateTime.Now,
            Disponibilidad = dto.Disponibilidad,
            FechaModificacion = DateTime.Now,
        };
        _context.CentrosPropiosEspecialidades.Add(entity);
        await _context.SaveChangesAsync();
        dto.Id = entity.CentroPropioEspecialidadId;
        return dto;
    }
    public async Task<bool> UpdateAsync(int id, Icg06EspecialidadDTO dto)
    {
        var entity = await _context.CentrosPropiosEspecialidades.FindAsync(id);
        if (entity == null) return false;
        entity.EspecialidadId    = dto.EspecialidadId;
        entity.Servicio          = dto.Servicio ?? entity.Servicio;
        entity.Cantidad          = dto.Cantidad;
        entity.ImporteConIva     = dto.ImporteConIva;
        entity.Disponibilidad    = dto.Disponibilidad;
        entity.FechaModificacion = DateTime.Now;
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.CentrosPropiosEspecialidades.FindAsync(id);
        if (entity == null) return false;
        _context.CentrosPropiosEspecialidades.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}