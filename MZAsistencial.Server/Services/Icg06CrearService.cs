using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;

namespace MZAsistencial.Server.Services;

public class Icg06CrearService
{
    private readonly MZAsistencialContext _context;

    public Icg06CrearService(MZAsistencialContext context)
    {
        _context = context;
    }

    // Comprueba si ya existe un registro ICG06 para ese centro y año
    public async Task<bool> ExisteAsync(int centroId, int año)
    {
        return await _context.Icg06s
            .AnyAsync(e => e.CentroId == centroId && e.Año == año);
    }

    // Crea un registro ICG06 vacío usando SQL directo (la entidad no tiene PK en EF)
    public async Task<int> CrearAsync(int centroId, int año, int? usuarioId)
    {
        var sql = @"
            INSERT INTO ICG06 (Centro_id, Año, Validado, FechaAlta, FechaModificacion, UsuarioAlta_id, UsuarioModificacion_id)
            OUTPUT INSERTED.Id_ICG
            VALUES ({0}, {1}, 0, {2}, {2}, {3}, {3})";

        var ahora      = DateTime.Now;
        object usuParam = (object?)usuarioId ?? DBNull.Value;

        var result = await _context.Database
            .SqlQueryRaw<int>(sql, centroId, año, ahora, usuParam)
            .ToListAsync();

        return result.FirstOrDefault();
    }
}