using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Services
{
    public class Icg06ItAmbService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public Icg06ItAmbService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        public async Task<Icg06ItAmbDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06ItAmbDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06ItAmbDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            PaotmutArt12                = e.PaotmutArt12,
            PrimConsotmutArt12Prog       = e.PrimConsotmutArt12Prog,
            PrimConsotmutArt12ProgVideo  = e.PrimConsotmutArt12ProgVideo,
            PrimConotmutArt12NoProg      = e.PrimConotmutArt12NoProg,
            PrimConotmutArt12NoProgVideo = e.PrimConotmutArt12NoProgVideo,
            ConssucotmutArt12            = e.ConssucotmutArt12,
            ConssucotmutArt12Video       = e.ConssucotmutArt12Video,
            ConsEnfotmutArt12            = e.ConsEnfotmutArt12,
            PradotmutArt12Rm             = e.PradotmutArt12Rm,
            PradotmutArt12Eco            = e.PradotmutArt12Eco,
            PradotmutArt12Tac            = e.PradotmutArt12Tac,
            PradotmutArt12Radio          = e.PradotmutArt12Radio,
            IquirotmutArt12              = e.IquirotmutArt12,
            OppractotmutArt12            = e.OppractotmutArt12,
            SesrehabotmutArt12           = e.SesrehabotmutArt12,
            PruBiomotmutArt12            = e.PruBiomotmutArt12,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06ItAmbDTO dto, Icg06 e)
        {
            e.PaotmutArt12                = dto.PaotmutArt12;
            e.PrimConsotmutArt12Prog       = dto.PrimConsotmutArt12Prog;
            e.PrimConsotmutArt12ProgVideo  = dto.PrimConsotmutArt12ProgVideo;
            e.PrimConotmutArt12NoProg      = dto.PrimConotmutArt12NoProg;
            e.PrimConotmutArt12NoProgVideo = dto.PrimConotmutArt12NoProgVideo;
            e.ConssucotmutArt12            = dto.ConssucotmutArt12;
            e.ConssucotmutArt12Video       = dto.ConssucotmutArt12Video;
            e.ConsEnfotmutArt12            = dto.ConsEnfotmutArt12;
            e.PradotmutArt12Rm             = dto.PradotmutArt12Rm;
            e.PradotmutArt12Eco            = dto.PradotmutArt12Eco;
            e.PradotmutArt12Tac            = dto.PradotmutArt12Tac;
            e.PradotmutArt12Radio          = dto.PradotmutArt12Radio;
            e.IquirotmutArt12              = dto.IquirotmutArt12;
            e.OppractotmutArt12            = dto.OppractotmutArt12;
            e.SesrehabotmutArt12           = dto.SesrehabotmutArt12;
            e.PruBiomotmutArt12            = dto.PruBiomotmutArt12;
        }
    }
}
