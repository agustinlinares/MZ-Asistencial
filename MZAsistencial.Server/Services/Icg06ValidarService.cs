using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;

namespace MZAsistencial.Server.Services;

public class Icg06ValidarService
{
    private readonly MZAsistencialContext _context;
    private readonly IRegistroErroresService _registroErroresService;

    public Icg06ValidarService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
    {
        _context = context;
        _registroErroresService = registroErroresService;
    }

    // FIX: se comprueba primero si el registro existe antes de leer Validado,
    //      para distinguir "no existe" de "Validado = null/0"
    public async Task<int?> GetValidadoAsync(int idIcg)
    {
        var entity = await _context.Icg06s
            .Where(e => e.IdIcg == idIcg)
            .Select(e => new { e.IdIcg, e.Validado })
            .FirstOrDefaultAsync();

        if (entity is null) return null;   // no existe el registro

        return entity.Validado;            // existe → devuelve el valor (puede ser null o 0)
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

        var ahora       = DateTime.Now;
        object usuParam = (object?)usuarioId ?? DBNull.Value;

        var rows = await _context.Database
            .ExecuteSqlRawAsync(sql, validado, ahora, usuParam, idIcg);

        return rows > 0;
    }
}