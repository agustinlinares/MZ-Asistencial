using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class Icg06ConvAmbService
    {
        private readonly MZAsistencialContext _context;

        public Icg06ConvAmbService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<Icg06ConvAmbDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06ConvAmbDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06ConvAmbDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            PacenConvSectBilMult              = e.PacenConvSectBilMult,
            PrimConsConvSectBilMultProg        = e.PrimConsConvSectBilMultProg,
            PrimConsConvSectBilMultProgVideo   = e.PrimConsConvSectBilMultProgVideo,
            PrimConsConvSectBilMultNoProg      = e.PrimConsConvSectBilMultNoProg,
            PrimConsConvSectBilMultNoProgVideo = e.PrimConsConvSectBilMultNoProgVideo,
            ConssucConvSectBilMult             = e.ConssucConvSectBilMult,
            ConssucConvSectBilMultVideo        = e.ConssucConvSectBilMultVideo,
            SesrehabConvSectBilMult            = e.SesrehabConvSectBilMult,
            ConsEnfConvSectBilMult             = e.ConsEnfConvSectBilMult,
            PradConvSectBilMultRm              = e.PradConvSectBilMultRm,
            PradConvSectBilMultEco             = e.PradConvSectBilMultEco,
            PradConvSectBilMultTac             = e.PradConvSectBilMultTac,
            PradConvSectBilMultRadio           = e.PradConvSectBilMultRadio,
            IquircenConvSectBilMult            = e.IquircenConvSectBilMult,
            OppractConvSectBilMult             = e.OppractConvSectBilMult,
            PruBiomConvSectBilMult             = e.PruBiomConvSectBilMult,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06ConvAmbDTO dto, Icg06 e)
        {
            e.PacenConvSectBilMult              = dto.PacenConvSectBilMult;
            e.PrimConsConvSectBilMultProg        = dto.PrimConsConvSectBilMultProg;
            e.PrimConsConvSectBilMultProgVideo   = dto.PrimConsConvSectBilMultProgVideo;
            e.PrimConsConvSectBilMultNoProg      = dto.PrimConsConvSectBilMultNoProg;
            e.PrimConsConvSectBilMultNoProgVideo = dto.PrimConsConvSectBilMultNoProgVideo;
            e.ConssucConvSectBilMult             = dto.ConssucConvSectBilMult;
            e.ConssucConvSectBilMultVideo        = dto.ConssucConvSectBilMultVideo;
            e.SesrehabConvSectBilMult            = dto.SesrehabConvSectBilMult;
            e.ConsEnfConvSectBilMult             = dto.ConsEnfConvSectBilMult;
            e.PradConvSectBilMultRm              = dto.PradConvSectBilMultRm;
            e.PradConvSectBilMultEco             = dto.PradConvSectBilMultEco;
            e.PradConvSectBilMultTac             = dto.PradConvSectBilMultTac;
            e.PradConvSectBilMultRadio           = dto.PradConvSectBilMultRadio;
            e.IquircenConvSectBilMult            = dto.IquircenConvSectBilMult;
            e.OppractConvSectBilMult             = dto.OppractConvSectBilMult;
            e.PruBiomConvSectBilMult             = dto.PruBiomConvSectBilMult;
        }
    }
}
