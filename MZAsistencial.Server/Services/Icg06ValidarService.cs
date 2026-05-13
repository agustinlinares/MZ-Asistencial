using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;

namespace MZAsistencial.Server.Services;

public class Icg06ValidarService
{
    private readonly MZAsistencialContext _context;

    public Icg06ValidarService(MZAsistencialContext context)
    {
        _context = context;
    }

    // Obtiene el estado actual de Validado para un registro ICG06
    public async Task<int?> GetValidadoAsync(int idIcg)
    {
        var result = await _context.Icg06s
            .Where(e => e.IdIcg == idIcg)
            .Select(e => e.Validado)
            .FirstOrDefaultAsync();

        return result;
    }

    // Cambia el estado Validado: 1 = validar, 0 = desvalidar
    public async Task<bool> SetValidadoAsync(int idIcg, int validado, int? usuarioId)
    {
        var sql = @"
            UPDATE ICG06
            SET Validado = {0},
                FechaModificacion = {1},
                UsuarioModificacion_id = {2}
            WHERE Id_ICG = {3}";

        var ahora      = DateTime.Now;
        object usuParam = (object?)usuarioId ?? DBNull.Value;

        var rows = await _context.Database
            .ExecuteSqlRawAsync(sql, validado, ahora, usuParam, idIcg);

        return rows > 0;
    }
}
