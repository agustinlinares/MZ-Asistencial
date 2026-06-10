using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Services
{
    public class Icg06ConvHosService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public Icg06ConvHosService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        public async Task<Icg06ConvHosDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06ConvHosDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06ConvHosDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            // Bloque 1
            PitrmutConvSecBilMultHos             = e.PitrmutConvSecBilMultHos,
            EsttrmutConvSecBilMultHos            = e.EsttrmutConvSecBilMultHos,
            PrimConsConvSecBilMultHosProg        = e.PrimConsConvSecBilMultHosProg,
            PrimConsConvSecBilMultHosProgVideo   = e.PrimConsConvSecBilMultHosProgVideo,
            PrimConsConvSecBilMultHosNoProg      = e.PrimConsConvSecBilMultHosNoProg,
            PrimConsConvSecBilMultHosNoProgVideo = e.PrimConsConvSecBilMultHosNoProgVideo,
            ConssucConvSecBilMultHos             = e.ConssucConvSecBilMultHos,
            ConssucConvSecBilMultHosVideo        = e.ConssucConvSecBilMultHosVideo,
            SrehabtrmutConvSecBilMultHos         = e.SrehabtrmutConvSecBilMultHos,
            ConsEnfConvSecBilMultHos             = e.ConsEnfConvSecBilMultHos,

            // Bloque 2
            PrmydtrmutConvSecBilMultHosRm    = e.PrmydtrmutConvSecBilMultHosRm,
            PrmydtrmutConvSecBilMultHosEco   = e.PrmydtrmutConvSecBilMultHosEco,
            PrmydtrmutConvSecBilMultHosTac   = e.PrmydtrmutConvSecBilMultHosTac,
            PrmydtrmutConvSecBilMultHosRadio = e.PrmydtrmutConvSecBilMultHosRadio,
            IquirtrmutConvSecBilMultHos      = e.IquirtrmutConvSecBilMultHos,
            OpptrmutConvSecBilMultHos        = e.OpptrmutConvSecBilMultHos,
            PrueBiomConvSecBilMultHos        = e.PrueBiomConvSecBilMultHos,
            PaurgNoIngrConvSecBilMultHos     = e.PaurgNoIngrConvSecBilMultHos,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06ConvHosDTO dto, Icg06 e)
        {
            // Bloque 1
            e.PitrmutConvSecBilMultHos             = dto.PitrmutConvSecBilMultHos;
            e.EsttrmutConvSecBilMultHos            = dto.EsttrmutConvSecBilMultHos;
            e.PrimConsConvSecBilMultHosProg        = dto.PrimConsConvSecBilMultHosProg;
            e.PrimConsConvSecBilMultHosProgVideo   = dto.PrimConsConvSecBilMultHosProgVideo;
            e.PrimConsConvSecBilMultHosNoProg      = dto.PrimConsConvSecBilMultHosNoProg;
            e.PrimConsConvSecBilMultHosNoProgVideo = dto.PrimConsConvSecBilMultHosNoProgVideo;
            e.ConssucConvSecBilMultHos             = dto.ConssucConvSecBilMultHos;
            e.ConssucConvSecBilMultHosVideo        = dto.ConssucConvSecBilMultHosVideo;
            e.SrehabtrmutConvSecBilMultHos         = dto.SrehabtrmutConvSecBilMultHos;
            e.ConsEnfConvSecBilMultHos             = dto.ConsEnfConvSecBilMultHos;

            // Bloque 2
            e.PrmydtrmutConvSecBilMultHosRm    = dto.PrmydtrmutConvSecBilMultHosRm;
            e.PrmydtrmutConvSecBilMultHosEco   = dto.PrmydtrmutConvSecBilMultHosEco;
            e.PrmydtrmutConvSecBilMultHosTac   = dto.PrmydtrmutConvSecBilMultHosTac;
            e.PrmydtrmutConvSecBilMultHosRadio = dto.PrmydtrmutConvSecBilMultHosRadio;
            e.IquirtrmutConvSecBilMultHos      = dto.IquirtrmutConvSecBilMultHos;
            e.OpptrmutConvSecBilMultHos        = dto.OpptrmutConvSecBilMultHos;
            e.PrueBiomConvSecBilMultHos        = dto.PrueBiomConvSecBilMultHos;
            e.PaurgNoIngrConvSecBilMultHos     = dto.PaurgNoIngrConvSecBilMultHos;
        }
    }
}
