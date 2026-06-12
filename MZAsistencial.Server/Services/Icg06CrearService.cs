using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services;

public class Icg06CrearService
{
    private readonly MZAsistencialContext _context;

    public Icg06CrearService(MZAsistencialContext context)
    {
        _context = context;
    }

    public async Task<bool> ExisteAsync(int centroId, int año)
    {
        return await _context.Icg06s
            .AnyAsync(e => e.CentroId == centroId && e.Año == año);
    }

    public async Task<int> CrearAsync(int centroId, int año, int? usuarioId)
    {
        var sql = @"
            INSERT INTO ICG06 (Centro_id, Año, Validado, FechaAlta, FechaModificacion, UsuarioAlta_id, UsuarioModificacion_id)
            OUTPUT INSERTED.Id_ICG
            VALUES ({0}, {1}, 0, {2}, {2}, {3}, {3})";

        var ahora       = DateTime.Now;
        object usuParam = (object?)usuarioId ?? DBNull.Value;

        var result = await _context.Database
            .SqlQueryRaw<int>(sql, centroId, año, ahora, usuParam)
            .ToListAsync();

        var nuevoId = result.FirstOrDefault();

        if (nuevoId > 0)
        {
            await RegistrarActividadAsync(
                usuarioId,
                $"INSERT ICG06 Centro {centroId} Año {año}",
                $"INSERT INTO ICG06 (Centro_id, Año, Validado, FechaAlta, UsuarioAlta_id) VALUES ({centroId}, {año}, 0, '{ahora}', {usuarioId})"
            );
        }

        return nuevoId;
    }

    // FIX: método de eliminación expuesto para el listado
    public async Task<bool> EliminarAsync(int idIcg, int? usuarioId)
    {
        var entity = await _context.Icg06s.FindAsync(idIcg);
        if (entity is null) return false;

        _context.Icg06s.Remove(entity);
        await _context.SaveChangesAsync();

        await RegistrarActividadAsync(
            usuarioId,
            $"DELETE ICG06 ID {idIcg}",
            $"DELETE FROM ICG06 WHERE Id_ICG={idIcg}"
        );

        return true;
    }

    private async Task RegistrarActividadAsync(int? usuarioId, string accion, string sql)
    {
        _context.RegistroActividads.Add(new RegistroActividad
        {
            UsuarioId = usuarioId,
            Fecha     = DateTime.Now,
            Accion    = accion,
            Sql       = sql
        });
        await _context.SaveChangesAsync();
    }
}