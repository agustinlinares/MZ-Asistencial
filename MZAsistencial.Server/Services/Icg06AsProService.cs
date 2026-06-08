using System.Globalization;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Services
{
    public class Icg06AsProService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public Icg06AsProService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        public async Task<Icg06AsProDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06AsProDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06AsProDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            // Fechas
            Actidesde = e.Actidesde,
            Actihasta = e.Actihasta,

            // Fila 1 — En el centro
            SesrehabtrmutCentro = e.Sesrehabtrmut != null ? decimal.TryParse(e.Sesrehabtrmut, NumberStyles.Any, CultureInfo.InvariantCulture, out var s) ? s : null : null,
            ConsEnftrmutCentro  = e.ConsEnftrmut,
            PradtrmutRm         = e.PradtrmutRm,
            PradtrmutEco        = e.PradtrmutEco,
            PradtrmutTac        = e.PradtrmutTac,
            PradtrmutRadio      = e.PradtrmutRadio,
            Iquirtrmut          = e.Iquirtrmut,
            Otrpptrmut          = e.Otrpptrmut,
            PruBiomtrmut        = e.PruBiomtrmut,

            // Fila 2 — 25 km
            Pacen25km               = e.Pacen25km,
            PrimConsProg25km        = e.PrimConsProg25km,
            PrimConsProgVideo25km   = e.PrimConsProgVideo25km,
            PrimConsNoProg25km      = e.PrimConsNoProg25km,
            PrimConsNoProgVideo25km = e.PrimConsNoProgVideo25km,
            Conssuc25km             = e.Conssuc25km,
            Conssuc25kmVideo        = e.Conssuc25kmVideo,

            // Fila 3 — 50 km
            Pacen50km               = e.Pacen50km,
            PrimConsProg50km        = e.PrimConsProg50km,
            PrimConsProgVideo50km   = e.PrimConsProgVideo50km,
            PrimConsNoProg50km      = e.PrimConsNoProg50km,
            PrimConsNoProgVideo50km = e.PrimConsNoProgVideo50km,
            Conssuc50km             = e.Conssuc50km,
            Conssuc50kmVideo        = e.Conssuc50kmVideo,

            // Fila 4 — +50 km
            Pacen50km1               = e.Pacen50km1,
            PrimConsProg50km1        = e.PrimConsProg50km1,
            PrimConsProgVideo50km1   = e.PrimConsProgVideo50km1,
            PrimConsNoProg50km1      = e.PrimConsNoProg50km1,
            PrimConsNoProgVideo50km1 = e.PrimConsNoProgVideo50km1,
            Conssuc50km1             = e.Conssuc50km1,

            // Fila 5 — Total
            NumPersAtendTotalTraMut      = e.NumPersAtendTotalTraMut,
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
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06AsProDTO dto, Icg06 e)
        {
            // Fechas
            e.Actidesde = dto.Actidesde;
            e.Actihasta = dto.Actihasta;

            // Fila 1 — En el centro
            e.Sesrehabtrmut = dto.SesrehabtrmutCentro?.ToString(CultureInfo.InvariantCulture);
            e.ConsEnftrmut  = dto.ConsEnftrmutCentro;
            e.PradtrmutRm   = dto.PradtrmutRm;
            e.PradtrmutEco  = dto.PradtrmutEco;
            e.PradtrmutTac  = dto.PradtrmutTac;
            e.PradtrmutRadio = dto.PradtrmutRadio;
            e.Iquirtrmut    = dto.Iquirtrmut;
            e.Otrpptrmut    = dto.Otrpptrmut;
            e.PruBiomtrmut  = dto.PruBiomtrmut;

            // Fila 2 — 25 km
            e.Pacen25km               = dto.Pacen25km;
            e.PrimConsProg25km        = dto.PrimConsProg25km;
            e.PrimConsProgVideo25km   = dto.PrimConsProgVideo25km;
            e.PrimConsNoProg25km      = dto.PrimConsNoProg25km;
            e.PrimConsNoProgVideo25km = dto.PrimConsNoProgVideo25km;
            e.Conssuc25km             = dto.Conssuc25km;
            e.Conssuc25kmVideo        = dto.Conssuc25kmVideo;

            // Fila 3 — 50 km
            e.Pacen50km               = dto.Pacen50km;
            e.PrimConsProg50km        = dto.PrimConsProg50km;
            e.PrimConsProgVideo50km   = dto.PrimConsProgVideo50km;
            e.PrimConsNoProg50km      = dto.PrimConsNoProg50km;
            e.PrimConsNoProgVideo50km = dto.PrimConsNoProgVideo50km;
            e.Conssuc50km             = dto.Conssuc50km;
            e.Conssuc50kmVideo        = dto.Conssuc50kmVideo;

            // Fila 4 — +50 km
            e.Pacen50km1               = dto.Pacen50km1;
            e.PrimConsProg50km1        = dto.PrimConsProg50km1;
            e.PrimConsProgVideo50km1   = dto.PrimConsProgVideo50km1;
            e.PrimConsNoProg50km1      = dto.PrimConsNoProg50km1;
            e.PrimConsNoProgVideo50km1 = dto.PrimConsNoProgVideo50km1;
            e.Conssuc50km1             = dto.Conssuc50km1;

            // Fila 5 — Total
            e.NumPersAtendTotalTraMut      = dto.NumPersAtendTotalTraMut;
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
        }
    }
}
