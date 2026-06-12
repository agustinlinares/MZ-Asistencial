using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class Icg06AmbService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public Icg06AmbService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        public async Task<Icg06AmbDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06AmbDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06AmbDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            // Otras Mutuas
            PaotmutArt12                = e.PaotmutArt12,
            PrimConsotmutArt12Prog       = e.PrimConsotmutArt12Prog,
            PrimConsotmutArt12ProgVideo  = e.PrimConsotmutArt12ProgVideo,
            PrimConotmutArt12NoProg      = e.PrimConotmutArt12NoProg,
            PrimConotmutArt12NoProgVideo = e.PrimConotmutArt12NoProgVideo,
            ConssucotmutArt12            = e.ConssucotmutArt12,
            ConssucotmutArt12Video       = e.ConssucotmutArt12Video,
            SesrehabotmutArt12           = e.SesrehabotmutArt12,
            ConsEnfotmutArt12            = e.ConsEnfotmutArt12,
            PradotmutArt12Rm             = e.PradotmutArt12Rm,
            PradotmutArt12Eco            = e.PradotmutArt12Eco,
            PradotmutArt12Tac            = e.PradotmutArt12Tac,
            PradotmutArt12Radio          = e.PradotmutArt12Radio,
            IquirotmutArt12              = e.IquirotmutArt12,
            OppractotmutArt12            = e.OppractotmutArt12,
            PruBiomotmutArt12            = e.PruBiomotmutArt12,

            // EG SS Art82
            PacenArt82               = e.PacenArt82,
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

            // Otros Art12
            PaotrosArt12                = e.PaotrosArt12,
            PrimConotrosArt12Prog        = e.PrimConotrosArt12Prog,
            PrimConotrosArt12ProgVideo   = e.PrimConotrosArt12ProgVideo,
            PrimConotrosArt12NoProg      = e.PrimConotrosArt12NoProg,
            PrimConotrosArt12NoProgVideo = e.PrimConotrosArt12NoProgVideo,
            ConssucotrosArt12            = e.ConssucotrosArt12,
            ConssucotrosArt12Video       = e.ConssucotrosArt12Video,
            SesrehabotrosArt12           = e.SesrehabotrosArt12,
            ConsEnfotrosArt12            = e.ConsEnfotrosArt12,
            PradotrosArt12Rm             = e.PradotrosArt12Rm,
            PradotrosArt12Eco            = e.PradotrosArt12Eco,
            PradotrosArt12Tac            = e.PradotrosArt12Tac,
            PradotrosArt12Radio          = e.PradotrosArt12Radio,
            IquirotrosArt12              = e.IquirotrosArt12,
            OppractotrosArt12            = e.OppractotrosArt12,
            PruBiomotrosArt12            = e.PruBiomotrosArt12,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06AmbDTO dto, Icg06 e)
        {
            // Otras Mutuas
            e.PaotmutArt12                = dto.PaotmutArt12;
            e.PrimConsotmutArt12Prog       = dto.PrimConsotmutArt12Prog;
            e.PrimConsotmutArt12ProgVideo  = dto.PrimConsotmutArt12ProgVideo;
            e.PrimConotmutArt12NoProg      = dto.PrimConotmutArt12NoProg;
            e.PrimConotmutArt12NoProgVideo = dto.PrimConotmutArt12NoProgVideo;
            e.ConssucotmutArt12            = dto.ConssucotmutArt12;
            e.ConssucotmutArt12Video       = dto.ConssucotmutArt12Video;
            e.SesrehabotmutArt12           = dto.SesrehabotmutArt12;
            e.ConsEnfotmutArt12            = dto.ConsEnfotmutArt12;
            e.PradotmutArt12Rm             = dto.PradotmutArt12Rm;
            e.PradotmutArt12Eco            = dto.PradotmutArt12Eco;
            e.PradotmutArt12Tac            = dto.PradotmutArt12Tac;
            e.PradotmutArt12Radio          = dto.PradotmutArt12Radio;
            e.IquirotmutArt12              = dto.IquirotmutArt12;
            e.OppractotmutArt12            = dto.OppractotmutArt12;
            e.PruBiomotmutArt12            = dto.PruBiomotmutArt12;

            // EG SS Art82
            e.PacenArt82               = dto.PacenArt82;
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

            // Otros Art12
            e.PaotrosArt12                = dto.PaotrosArt12;
            e.PrimConotrosArt12Prog        = dto.PrimConotrosArt12Prog;
            e.PrimConotrosArt12ProgVideo   = dto.PrimConotrosArt12ProgVideo;
            e.PrimConotrosArt12NoProg      = dto.PrimConotrosArt12NoProg;
            e.PrimConotrosArt12NoProgVideo = dto.PrimConotrosArt12NoProgVideo;
            e.ConssucotrosArt12            = dto.ConssucotrosArt12;
            e.ConssucotrosArt12Video       = dto.ConssucotrosArt12Video;
            e.SesrehabotrosArt12           = dto.SesrehabotrosArt12;
            e.ConsEnfotrosArt12            = dto.ConsEnfotrosArt12;
            e.PradotrosArt12Rm             = dto.PradotrosArt12Rm;
            e.PradotrosArt12Eco            = dto.PradotrosArt12Eco;
            e.PradotrosArt12Tac            = dto.PradotrosArt12Tac;
            e.PradotrosArt12Radio          = dto.PradotrosArt12Radio;
            e.IquirotrosArt12              = dto.IquirotrosArt12;
            e.OppractotrosArt12            = dto.OppractotrosArt12;
            e.PruBiomotrosArt12            = dto.PruBiomotrosArt12;
        }
    }
}