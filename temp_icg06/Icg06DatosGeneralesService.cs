using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class Icg06DatosGeneralesService
    {
        private readonly MZAsistencialContext _context;

        public Icg06DatosGeneralesService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<Icg06DatosGeneralesDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06DatosGeneralesDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06DatosGeneralesDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg        = e.IdIcg,
            Año          = e.Año,
            CentroId     = e.CentroId,
            Nfincreg     = e.Nfincreg,
            SuptotConst  = e.SuptotConst,
            OtrasObservac = e.OtrasObservac,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06DatosGeneralesDTO dto, Icg06 e)
        {
            e.Nfincreg     = dto.Nfincreg;
            e.SuptotConst  = dto.SuptotConst;
            e.OtrasObservac = dto.OtrasObservac;
        }
    }
}
