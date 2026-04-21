using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class Icg06OtrasHosService
    {
        private readonly MZAsistencialContext _context;

        public Icg06OtrasHosService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<Icg06OtrasHosDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06OtrasHosDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06OtrasHosDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            // Bloque 1
            PitrmutArt82Hos             = e.PitrmutArt82Hos,
            EsttrmutArt82Hos            = e.EsttrmutArt82Hos,
            PrimConsArt82HosProg        = e.PrimConsArt82HosProg,
            PrimConsArt82HosProgVideo   = e.PrimConsArt82HosProgVideo,
            PrimConsArt82HosNoProg      = e.PrimConsArt82HosNoProg,
            PrimConsArt82HosNoProgVideo = e.PrimConsArt82HosNoProgVideo,
            ConssucArt82Hos             = e.ConssucArt82Hos,
            ConssucArt82HosVideo        = e.ConssucArt82HosVideo,
            SrehabtrmutArt82Hos         = e.SrehabtrmutArt82Hos,
            ConsEnfArt82Hos             = e.ConsEnfArt82Hos,

            // Bloque 2
            PrmydtrmutArt82HosRm    = e.PrmydtrmutArt82HosRm,
            PrmydtrmutArt82HosEco   = e.PrmydtrmutArt82HosEco,
            PrmydtrmutArt82HosTac   = e.PrmydtrmutArt82HosTac,
            PrmydtrmutArt82HosRadio = e.PrmydtrmutArt82HosRadio,
            IquirtrmutArt82Hos      = e.IquirtrmutArt82Hos,
            OpptrmutArt82Hos        = e.OpptrmutArt82Hos,
            PrueBiomArt82Hos        = e.PrueBiomArt82Hos,
            PaurgNoIngrArt82Hos     = e.PaurgNoIngrArt82Hos,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06OtrasHosDTO dto, Icg06 e)
        {
            // Bloque 1
            e.PitrmutArt82Hos             = dto.PitrmutArt82Hos;
            e.EsttrmutArt82Hos            = dto.EsttrmutArt82Hos;
            e.PrimConsArt82HosProg        = dto.PrimConsArt82HosProg;
            e.PrimConsArt82HosProgVideo   = dto.PrimConsArt82HosProgVideo;
            e.PrimConsArt82HosNoProg      = dto.PrimConsArt82HosNoProg;
            e.PrimConsArt82HosNoProgVideo = dto.PrimConsArt82HosNoProgVideo;
            e.ConssucArt82Hos             = dto.ConssucArt82Hos;
            e.ConssucArt82HosVideo        = dto.ConssucArt82HosVideo;
            e.SrehabtrmutArt82Hos         = dto.SrehabtrmutArt82Hos;
            e.ConsEnfArt82Hos             = dto.ConsEnfArt82Hos;

            // Bloque 2
            e.PrmydtrmutArt82HosRm    = dto.PrmydtrmutArt82HosRm;
            e.PrmydtrmutArt82HosEco   = dto.PrmydtrmutArt82HosEco;
            e.PrmydtrmutArt82HosTac   = dto.PrmydtrmutArt82HosTac;
            e.PrmydtrmutArt82HosRadio = dto.PrmydtrmutArt82HosRadio;
            e.IquirtrmutArt82Hos      = dto.IquirtrmutArt82Hos;
            e.OpptrmutArt82Hos        = dto.OpptrmutArt82Hos;
            e.PrueBiomArt82Hos        = dto.PrueBiomArt82Hos;
            e.PaurgNoIngrArt82Hos     = dto.PaurgNoIngrArt82Hos;
        }
    }
}
