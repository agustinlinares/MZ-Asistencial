using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services;

public class Icg06EspecialidadService
{
    private readonly MZAsistencialContext _context;

    public Icg06EspecialidadService(MZAsistencialContext context)
    {
        _context = context;
    }

    // GET: lista de especialidades de un centro y año
    public async Task<List<Icg06EspecialidadDTO>> GetByCentroYAñoAsync(int centroId, int año)
    {
        return await _context.Icg06Especialidades
            .Where(e => e.CentroId == centroId && e.Año == año)
            .OrderBy(e => e.Especialidad)
            .ThenBy(e => e.Servicio)
            .Select(e => new Icg06EspecialidadDTO
            {
                Id           = e.Id,
                CentroId     = e.CentroId,
                Año          = e.Año,
                Especialidad = e.Especialidad,
                Servicio     = e.Servicio,
                Cantidad     = e.Cantidad,
            })
            .ToListAsync();
    }

    // POST: crear nueva especialidad
    public async Task<Icg06EspecialidadDTO> CreateAsync(Icg06EspecialidadDTO dto)
    {
        var entity = new Icg06Especialidad
        {
            CentroId     = dto.CentroId,
            Año          = dto.Año,
            Especialidad = dto.Especialidad,
            Servicio     = dto.Servicio,
            Cantidad     = dto.Cantidad,
        };

        _context.Icg06Especialidades.Add(entity);
        await _context.SaveChangesAsync();

        dto.Id = entity.Id;
        return dto;
    }

    // PUT: actualizar especialidad existente
    public async Task<bool> UpdateAsync(int id, Icg06EspecialidadDTO dto)
    {
        var entity = await _context.Icg06Especialidades.FindAsync(id);
        if (entity == null) return false;

        entity.Especialidad = dto.Especialidad;
        entity.Servicio     = dto.Servicio;
        entity.Cantidad     = dto.Cantidad;

        await _context.SaveChangesAsync();
        return true;
    }

    // DELETE: eliminar especialidad
    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.Icg06Especialidades.FindAsync(id);
        if (entity == null) return false;

        _context.Icg06Especialidades.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
