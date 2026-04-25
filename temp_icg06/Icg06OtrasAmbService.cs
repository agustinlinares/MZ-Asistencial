using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class Icg06OtrasAmbService
    {
        private readonly MZAsistencialContext _context;

        public Icg06OtrasAmbService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<Icg06OtrasAmbDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06OtrasAmbDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06OtrasAmbDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            PacenArt82              = e.PacenArt82,
            PrimConsArt82Prog        = e.PrimConsArt82Prog,
            PrimConsArt82ProgVideo   = e.PrimConsArt82ProgVideo,
            PrimConsArt82NoProg      = e.PrimConsArt82NoProg,
            PrimConsArt82NoProgVideo = e.PrimConsArt82NoProgVideo,
            ConssucArt82             = e.ConssucArt82,
            ConssucArt82Video        = e.ConssucArt82Video,
            SesrehabArt82            = e.SesrehabArt82,
            ConsEnfArt82             = e.ConsEnfArt82,
            PradArt82Rm              = e.PradArt82Rm,
            PradArt82Eco             = e.PradArt82Eco,
            PradArt82Tac             = e.PradArt82Tac,
            PradArt82Radio           = e.PradArt82Radio,
            IquircenArt82            = e.IquircenArt82,
            OppractArt82             = e.OppractArt82,
            PruBiomArt82             = e.PruBiomArt82,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06OtrasAmbDTO dto, Icg06 e)
        {
            e.PacenArt82              = dto.PacenArt82;
            e.PrimConsArt82Prog        = dto.PrimConsArt82Prog;
            e.PrimConsArt82ProgVideo   = dto.PrimConsArt82ProgVideo;
            e.PrimConsArt82NoProg      = dto.PrimConsArt82NoProg;
            e.PrimConsArt82NoProgVideo = dto.PrimConsArt82NoProgVideo;
            e.ConssucArt82             = dto.ConssucArt82;
            e.ConssucArt82Video        = dto.ConssucArt82Video;
            e.SesrehabArt82            = dto.SesrehabArt82;
            e.ConsEnfArt82             = dto.ConsEnfArt82;
            e.PradArt82Rm              = dto.PradArt82Rm;
            e.PradArt82Eco             = dto.PradArt82Eco;
            e.PradArt82Tac             = dto.PradArt82Tac;
            e.PradArt82Radio           = dto.PradArt82Radio;
            e.IquircenArt82            = dto.IquircenArt82;
            e.OppractArt82             = dto.OppractArt82;
            e.PruBiomArt82             = dto.PruBiomArt82;
        }
    }
}
