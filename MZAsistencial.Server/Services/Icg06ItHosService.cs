using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Services
{
    public class Icg06ItHosService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public Icg06ItHosService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        public async Task<Icg06ItHosDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06ItHosDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06ItHosDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            // Bloque 1
            PitrmutHos             = e.PitrmutHos,
            EsttrmutHos            = e.EsttrmutHos,
            PrimConsHosProg        = e.PrimConsHosProg,
            PrimConsHosProgVideo   = e.PrimConsHosProgVideo,
            PrimConsHosNoProg      = e.PrimConsHosNoProg,
            PrimConsHosNoProgVideo = e.PrimConsHosNoProgVideo,
            ConssucHos             = e.ConssucHos,
            ConssucHosVideo        = e.ConssucHosVideo,
            SesrehabtrmutHos       = e.SesrehabtrmutHos,
            ConsEnfHos             = e.ConsEnfHos,

            // Bloque 2
            PradtrmutHosRm    = e.PradtrmutHosRm,
            PradtrmutHosEco   = e.PradtrmutHosEco,
            PradtrmutHosTac   = e.PradtrmutHosTac,
            PradtrmutHosRadio = e.PradtrmutHosRadio,
            IquirtrmutHos     = e.IquirtrmutHos,
            OppracttrmutHos   = e.OppracttrmutHos,
            PruBiomHos        = e.PruBiomHos,
            PaurnointrmutHos  = e.PaurnointrmutHos,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06ItHosDTO dto, Icg06 e)
        {
            // Bloque 1
            e.PitrmutHos             = dto.PitrmutHos;
            e.EsttrmutHos            = dto.EsttrmutHos;
            e.PrimConsHosProg        = dto.PrimConsHosProg;
            e.PrimConsHosProgVideo   = dto.PrimConsHosProgVideo;
            e.PrimConsHosNoProg      = dto.PrimConsHosNoProg;
            e.PrimConsHosNoProgVideo = dto.PrimConsHosNoProgVideo;
            e.ConssucHos             = dto.ConssucHos;
            e.ConssucHosVideo        = dto.ConssucHosVideo;
            e.SesrehabtrmutHos       = dto.SesrehabtrmutHos;
            e.ConsEnfHos             = dto.ConsEnfHos;

            // Bloque 2
            e.PradtrmutHosRm    = dto.PradtrmutHosRm;
            e.PradtrmutHosEco   = dto.PradtrmutHosEco;
            e.PradtrmutHosTac   = dto.PradtrmutHosTac;
            e.PradtrmutHosRadio = dto.PradtrmutHosRadio;
            e.IquirtrmutHos     = dto.IquirtrmutHos;
            e.OppracttrmutHos   = dto.OppracttrmutHos;
            e.PruBiomHos        = dto.PruBiomHos;
            e.PaurnointrmutHos  = dto.PaurnointrmutHos;
        }
    }
}
