using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Services
{
    public class Icg06PoblacionProtegidaService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public Icg06PoblacionProtegidaService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        public async Task<Icg06PoblacionProtegidaDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06PoblacionProtegidaDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06PoblacionProtegidaDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg          = e.IdIcg,
            Año            = e.Año,
            CentroId       = e.CentroId,

            Pobpr25kmAd    = e.Pobpr25kmAd,
            Pobpr50kmAd    = e.Pobpr50kmAd,
            Pobprmas50Ad   = e.Pobprmas50Ad,
            Obs25kmAd      = e.Obs25kmAd,
            Obs50kmAd      = e.Obs50kmAd,
            Obsmas50kmAd   = e.Obsmas50kmAd,

            Pobpr25kmCp    = e.Pobpr25kmCp,
            Pobpr50kmCp    = e.Pobpr50kmCp,
            Pobprmas50Cp   = e.Pobprmas50Cp,

            Pobpr25kmItcc  = e.Pobpr25kmItcc,
            Pobpr50kmItcc  = e.Pobpr50kmItcc,
            Pobprmas50Itcc = e.Pobprmas50Itcc,

            Obs25km        = e.Obs25km,
            Obs50km        = e.Obs50km,
            Obsmas50km     = e.Obsmas50km,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06PoblacionProtegidaDTO dto, Icg06 e)
        {
            e.Pobpr25kmAd    = dto.Pobpr25kmAd;
            e.Pobpr50kmAd    = dto.Pobpr50kmAd;
            e.Pobprmas50Ad   = dto.Pobprmas50Ad;
            e.Obs25kmAd      = dto.Obs25kmAd;
            e.Obs50kmAd      = dto.Obs50kmAd;
            e.Obsmas50kmAd   = dto.Obsmas50kmAd;

            e.Pobpr25kmCp    = dto.Pobpr25kmCp;
            e.Pobpr50kmCp    = dto.Pobpr50kmCp;
            e.Pobprmas50Cp   = dto.Pobprmas50Cp;

            e.Pobpr25kmItcc  = dto.Pobpr25kmItcc;
            e.Pobpr50kmItcc  = dto.Pobpr50kmItcc;
            e.Pobprmas50Itcc = dto.Pobprmas50Itcc;

            e.Obs25km        = dto.Obs25km;
            e.Obs50km        = dto.Obs50km;
            e.Obsmas50km     = dto.Obsmas50km;
        }
    }
}
