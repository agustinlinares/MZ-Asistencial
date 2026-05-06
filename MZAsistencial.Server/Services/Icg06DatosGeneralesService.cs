using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs.ICG06;

namespace MZAsistencial.Server.Services.ICG06;

public class Icg06DatosGeneralesService
{
    private readonly MZAsistencialContext _db;

    public Icg06DatosGeneralesService(MZAsistencialContext db)
        => _db = db;

    // GET /api/Icg06DatosGenerales?centroId=...&año=...
    public async Task<Icg06DatosGeneralesDto?> ObtenerAsync(int centroId, int año)
    {
        var registro = await _db.Icg06s
            .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

        if (registro is null) return null;

        return new Icg06DatosGeneralesDto
        {
            IdIcg         = registro.IdIcg,
            CentroId      = centroId,
            Año           = año,
            Nfincreg      = registro.Nfincreg      != null ? (int?)Convert.ToInt32(registro.Nfincreg)          : null,
            SuptotConst   = registro.SuptotConst   != null ? (decimal?)Convert.ToDecimal(registro.SuptotConst) : null,
            OtrasObservac = registro.OtrasObservac,
        };
    }

    // PUT /api/Icg06DatosGenerales/{idIcg}
    public async Task ActualizarAsync(int idIcg, Icg06DatosGeneralesDto dto)
    {
        ValidarDto(dto);

        var registro = await _db.Icg06s
            .FirstOrDefaultAsync(x => x.IdIcg == idIcg)
            ?? throw new KeyNotFoundException($"ICG06 con Id {idIcg} no encontrado.");

        registro.Nfincreg          = dto.Nfincreg    != null ? Convert.ToDecimal(dto.Nfincreg) : null;
        registro.SuptotConst       = dto.SuptotConst;
        registro.OtrasObservac     = dto.OtrasObservac?.Trim();
        registro.FechaModificacion = DateTime.Now;

        await _db.SaveChangesAsync();
    }

    // ─── validaciones ────────────────────────────────────────────────────────

    private static void ValidarDto(Icg06DatosGeneralesDto dto)
    {
        if (dto.Nfincreg.HasValue && dto.Nfincreg.Value < 0)
            throw new ArgumentException("El número de fincas no puede ser negativo.");

        if (dto.SuptotConst.HasValue && dto.SuptotConst.Value < 0)
            throw new ArgumentException("La superficie no puede ser negativa.");

        if (dto.OtrasObservac?.Length > 2000)
            throw new ArgumentException("Las observaciones no pueden superar 2.000 caracteres.");
    }
}
