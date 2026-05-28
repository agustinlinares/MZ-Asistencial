using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class Icg06DatosPlantillaService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public Icg06DatosPlantillaService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        public async Task<Icg06DatosPlantillaDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            try
            {
                var entity = await _context.Icg06s
                    .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

                if (entity is null) return null;

                return MapToDTO(entity);
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Plantillas ICG (Datos) - GetByCentroYAñoAsync");
                throw;
            }
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06DatosPlantillaDTO dto)
        {
            try
            {
                var entity = await _context.Icg06s.FindAsync(idIcg);
                if (entity is null) return false;

                MapToEntity(dto, entity);
                entity.FechaModificacion = DateTime.Now;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                await _registroErroresService.LogErrorAsync(ex, "Plantillas ICG (Datos) - UpdateAsync");
                throw;
            }
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06DatosPlantillaDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            PersSanitMedArt6NumPers          = e.PersSanitMedArt6NumPers,
            PersSanitMedArt6GastPers         = e.PersSanitMedArt6GastPers,
            PersSanitMedArt6HorasCp          = e.PersSanitMedArt6HorasCp,
            PersSanitMedArt6HorasCc          = e.PersSanitMedArt6HorasCc,
            PersSanitMedArt6HorasIt          = e.PersSanitMedArt6HorasIt,
            PersSanitMedArt6HorasAtep        = e.PersSanitMedArt6HorasAtep,
            PersSanitMedArt6HorasAgm         = e.PersSanitMedArt6HorasAgm,
            PersSanitMedArt6NumPersSustInt   = e.PersSanitMedArt6NumPersSustInt,
            PersSanitMedArt6GastPersSustInt  = e.PersSanitMedArt6GastPersSustInt,
            PersSanitMedArt6HorasPersSustInt = e.PersSanitMedArt6HorasPersSustInt,

            PersSanitMedEspArt6NumPers          = e.PersSanitMedEspArt6NumPers,
            PersSanitMedEspArt6GastPers         = e.PersSanitMedEspArt6GastPers,
            PersSanitMedEspArt6HorasCp          = e.PersSanitMedEspArt6HorasCp,
            PersSanitMedEspArt6HorasCc          = e.PersSanitMedEspArt6HorasCc,
            PersSanitMedEspArt6HorasIt          = e.PersSanitMedEspArt6HorasIt,
            PersSanitMedEspArt6HorasAtep        = e.PersSanitMedEspArt6HorasAtep,
            PersSanitMedEspArt6HorasAgm         = e.PersSanitMedEspArt6HorasAgm,
            PersSanitMedEspArt6NumPersSustInt   = e.PersSanitMedEspArt6NumPersSustInt,
            PersSanitMedEspArt6GastPersSustInt  = e.PersSanitMedEspArt6GastPersSustInt,
            PersSanitMedEspArt6HorasPersSustInt = e.PersSanitMedEspArt6HorasPersSustInt,

            PersSanitMedGesArt6NumPers          = e.PersSanitMedGesArt6NumPers,
            PersSanitMedGesArt6GastPers         = e.PersSanitMedGesArt6GastPers,
            PersSanitMedGesArt6HorasCp          = e.PersSanitMedGesArt6HorasCp,
            PersSanitMedGesArt6HorasCc          = e.PersSanitMedGesArt6HorasCc,
            PersSanitMedGesArt6HorasIt          = e.PersSanitMedGesArt6HorasIt,
            PersSanitMedGesArt6HorasAtep        = e.PersSanitMedGesArt6HorasAtep,
            PersSanitMedGesArt6HorasAgm         = e.PersSanitMedGesArt6HorasAgm,
            PersSanitMedGesArt6NumPersSustInt   = e.PersSanitMedGesArt6NumPersSustInt,
            PersSanitMedGesArt6GastPersSustInt  = e.PersSanitMedGesArt6GastPersSustInt,
            PersSanitMedGesArt6HorasPersSustInt = e.PersSanitMedGesArt6HorasPersSustInt,

            PersSanitArt7DuenumPers          = e.PersSanitArt7DuenumPers,
            PersSanitArt7DuegastPers         = e.PersSanitArt7DuegastPers,
            PersSanitArt7DuehorasCp          = e.PersSanitArt7DuehorasCp,
            PersSanitArt7DuehorasCc          = e.PersSanitArt7DuehorasCc,
            PersSanitArt7DuehorasIt          = e.PersSanitArt7DuehorasIt,
            PersSanitArt7DuehorasAtep        = e.PersSanitArt7DuehorasAtep,
            PersSanitArt7DuehorasAgm         = e.PersSanitArt7DuehorasAgm,
            PersSanitArt7DuenumPersSustInt   = e.PersSanitArt7DuenumPersSustInt,
            PersSanitArt7DuegastPersSustInt  = e.PersSanitArt7DuegastPersSustInt,
            PersSanitArt7DuehorasPersSustInt = e.PersSanitArt7DuehorasPersSustInt,

            PersSanitArt7FisNumPers          = e.PersSanitArt7FisNumPers,
            PersSanitArt7FisGastPers         = e.PersSanitArt7FisGastPers,
            PersSanitArt7FisHorasCp          = e.PersSanitArt7FisHorasCp,
            PersSanitArt7FisHorasCc          = e.PersSanitArt7FisHorasCc,
            PersSanitArt7FisHorasIt          = e.PersSanitArt7FisHorasIt,
            PersSanitArt7FisHorasAtep        = e.PersSanitArt7FisHorasAtep,
            PersSanitArt7FisHorasAgm         = e.PersSanitArt7FisHorasAgm,
            PersSanitArt7FisNumPersSustInt   = e.PersSanitArt7FisNumPersSustInt,
            PersSanitArt7FisGastPersSustInt  = e.PersSanitArt7FisGastPersSustInt,
            PersSanitArt7FisHorasPersSustInt = e.PersSanitArt7FisHorasPersSustInt,

            PersSanitArt7PsicoNumPers          = e.PersSanitArt7PsicoNumPers,
            PersSanitArt7PsicoGastPers         = e.PersSanitArt7PsicoGastPers,
            PersSanitArt7PsicoHorasCp          = e.PersSanitArt7PsicoHorasCp,
            PersSanitArt7PsicoHorasCc          = e.PersSanitArt7PsicoHorasCc,
            PersSanitArt7PsicoHorasIt          = e.PersSanitArt7PsicoHorasIt,
            PersSanitArt7PsicoHorasAtep        = e.PersSanitArt7PsicoHorasAtep,
            PersSanitArt7PsicoHorasAgm         = e.PersSanitArt7PsicoHorasAgm,
            PersSanitArt7PsicoNumPersSustInt   = e.PersSanitArt7PsicoNumPersSustInt,
            PersSanitArt7PsicoGastPersSustInt  = e.PersSanitArt7PsicoGastPersSustInt,
            PersSanitArt7PsicoHorasPersSustInt = e.PersSanitArt7PsicoHorasPersSustInt,

            PersSanitArt7TrSocNumPers          = e.PersSanitArt7TrSocNumPers,
            PersSanitArt7TrSocGastPers         = e.PersSanitArt7TrSocGastPers,
            PersSanitArt7TrSocHorasCp          = e.PersSanitArt7TrSocHorasCp,
            PersSanitArt7TrSocHorasCc          = e.PersSanitArt7TrSocHorasCc,
            PersSanitArt7TrSocHorasIt          = e.PersSanitArt7TrSocHorasIt,
            PersSanitArt7TrSocHorasAtep        = e.PersSanitArt7TrSocHorasAtep,
            PersSanitArt7TrSocHorasAgm         = e.PersSanitArt7TrSocHorasAgm,
            PersSanitArt7TrSocNumPersSustInt   = e.PersSanitArt7TrSocNumPersSustInt,
            PersSanitArt7TrSocGastPersSustInt  = e.PersSanitArt7TrSocGastPersSustInt,
            PersSanitArt7TrSocHorasPersSustInt = e.PersSanitArt7TrSocHorasPersSustInt,

            PersSanitArt7TerOcuNumPers          = e.PersSanitArt7TerOcuNumPers,
            PersSanitArt7TerOcuGastPers         = e.PersSanitArt7TerOcuGastPers,
            PersSanitArt7TerOcuHorasCp          = e.PersSanitArt7TerOcuHorasCp,
            PersSanitArt7TerOcuHorasCc          = e.PersSanitArt7TerOcuHorasCc,
            PersSanitArt7TerOcuHorasIt          = e.PersSanitArt7TerOcuHorasIt,
            PersSanitArt7TerOcuHorasAtep        = e.PersSanitArt7TerOcuHorasAtep,
            PersSanitArt7TerOcuHorasAgm         = e.PersSanitArt7TerOcuHorasAgm,
            PersSanitArt7TerOcuNumPersSustInt   = e.PersSanitArt7TerOcuNumPersSustInt,
            PersSanitArt7TerOcuGastPersSustInt  = e.PersSanitArt7TerOcuGastPersSustInt,
            PersSanitArt7TerOcuHorasPersSustInt = e.PersSanitArt7TerOcuHorasPersSustInt,

            PersSanitArt7TecRxnumPers          = e.PersSanitArt7TecRxnumPers,
            PersSanitArt7TecRxgastPers         = e.PersSanitArt7TecRxgastPers,
            PersSanitArt7TecRxhorasCp          = e.PersSanitArt7TecRxhorasCp,
            PersSanitArt7TecRxhorasCc          = e.PersSanitArt7TecRxhorasCc,
            PersSanitArt7TecRxhorasIt          = e.PersSanitArt7TecRxhorasIt,
            PersSanitArt7TecRxhorasAtep        = e.PersSanitArt7TecRxhorasAtep,
            PersSanitArt7TecRxhorasAgm         = e.PersSanitArt7TecRxhorasAgm,
            PersSanitArt7TecRxnumPersSustInt   = e.PersSanitArt7TecRxnumPersSustInt,
            PersSanitArt7TecRxgastPersSustInt  = e.PersSanitArt7TecRxgastPersSustInt,
            PersSanitArt7TecRxhorasPersSustInt = e.PersSanitArt7TecRxhorasPersSustInt,

            PersSanitArt7RestNumPers          = e.PersSanitArt7RestNumPers,
            PersSanitArt7RestGastPers         = e.PersSanitArt7RestGastPers,
            PersSanitArt7RestHorasCp          = e.PersSanitArt7RestHorasCp,
            PersSanitArt7RestHorasCc          = e.PersSanitArt7RestHorasCc,
            PersSanitArt7RestHorasIt          = e.PersSanitArt7RestHorasIt,
            PersSanitArt7RestHorasAtep        = e.PersSanitArt7RestHorasAtep,
            PersSanitArt7RestHorasAgm         = e.PersSanitArt7RestHorasAgm,
            PersSanitArt7RestNumPersSustInt   = e.PersSanitArt7RestNumPersSustInt,
            PersSanitArt7RestGastPersSustInt  = e.PersSanitArt7RestGastPersSustInt,
            PersSanitArt7RestHorasPersSustInt = e.PersSanitArt7RestHorasPersSustInt,

            PersSanitGradSupNumPers          = e.PersSanitGradSupNumPers,
            PersSanitGradSupGastPers         = e.PersSanitGradSupGastPers,
            PersSanitGradSupHorasCp          = e.PersSanitGradSupHorasCp,
            PersSanitGradSupHorasCc          = e.PersSanitGradSupHorasCc,
            PersSanitGradSupHorasIt          = e.PersSanitGradSupHorasIt,
            PersSanitGradSupHorasAtep        = e.PersSanitGradSupHorasAtep,
            PersSanitGradSupHorasAgm         = e.PersSanitGradSupHorasAgm,
            PersSanitGradSupNumPersSustInt   = e.PersSanitGradSupNumPersSustInt,
            PersSanitGradSupGastPersSustInt  = e.PersSanitGradSupGastPersSustInt,
            PersSanitGradSupHorasPersSustInt = e.PersSanitGradSupHorasPersSustInt,

            PersSanitGradMedAuxEnfNumPers          = e.PersSanitGradMedAuxEnfNumPers,
            PersSanitGradMedAuxEnfGastPers         = e.PersSanitGradMedAuxEnfGastPers,
            PersSanitGradMedAuxEnfHorasCp          = e.PersSanitGradMedAuxEnfHorasCp,
            PersSanitGradMedAuxEnfHorasCc          = e.PersSanitGradMedAuxEnfHorasCc,
            PersSanitGradMedAuxEnfHorasIt          = e.PersSanitGradMedAuxEnfHorasIt,
            PersSanitGradMedAuxEnfHorasAtep        = e.PersSanitGradMedAuxEnfHorasAtep,
            PersSanitGradMedAuxEnfHorasAgm         = e.PersSanitGradMedAuxEnfHorasAgm,
            PersSanitGradMedAuxEnfNumPersSustInt   = e.PersSanitGradMedAuxEnfNumPersSustInt,
            PersSanitGradMedAuxEnfGastPersSustInt  = e.PersSanitGradMedAuxEnfGastPersSustInt,
            PersSanitGradMedAuxEnfHorasPersSustInt = e.PersSanitGradMedAuxEnfHorasPersSustInt,

            PersSanitGradMedRestNumPers          = e.PersSanitGradMedRestNumPers,
            PersSanitGradMedRestGastPers         = e.PersSanitGradMedRestGastPers,
            PersSanitGradMedRestHorasCp          = e.PersSanitGradMedRestHorasCp,
            PersSanitGradMedRestHorasCc          = e.PersSanitGradMedRestHorasCc,
            PersSanitGradMedRestHorasIt          = e.PersSanitGradMedRestHorasIt,
            PersSanitGradMedRestHorasAtep        = e.PersSanitGradMedRestHorasAtep,
            PersSanitGradMedRestHorasAgm         = e.PersSanitGradMedRestHorasAgm,
            PersSanitGradMedRestNumPersSustInt   = e.PersSanitGradMedRestNumPersSustInt,
            PersSanitGradMedRestGastPersSustInt  = e.PersSanitGradMedRestGastPersSustInt,
            PersSanitGradMedRestHorasPersSustInt = e.PersSanitGradMedRestHorasPersSustInt,

            RestPersSanitNumPers          = e.RestPersSanitNumPers,
            RestPersSanitGastPers         = e.RestPersSanitGastPers,
            RestPersSanitHorasCp          = e.RestPersSanitHorasCp,
            RestPersSanitHorasCc          = e.RestPersSanitHorasCc,
            RestPersSanitHorasIt          = e.RestPersSanitHorasIt,
            RestPersSanitHorasAtep        = e.RestPersSanitHorasAtep,
            RestPersSanitHorasAgm         = e.RestPersSanitHorasAgm,
            RestPersSanitNumPersSustInt   = e.RestPersSanitNumPersSustInt,
            RestPersSanitGastPersSustInt  = e.RestPersSanitGastPersSustInt,
            RestPersSanitHorasPersSustInt = e.RestPersSanitHorasPersSustInt,

            PersDirCenNumPers          = e.PersDirCenNumPers,
            PersDirCenGastPers         = e.PersDirCenGastPers,
            PersDirCenHorasCp          = e.PersDirCenHorasCp,
            PersDirCenHorasCc          = e.PersDirCenHorasCc,
            PersDirCenHorasIt          = e.PersDirCenHorasIt,
            PersDirCenHorasAtep        = e.PersDirCenHorasAtep,
            PersDirCenHorasAgm         = e.PersDirCenHorasAgm,
            PersDirCenNumPersSustInt   = e.PersDirCenNumPersSustInt,
            PersDirCenGastPersSustInt  = e.PersDirCenGastPersSustInt,
            PersDirCenHorasPersSustInt = e.PersDirCenHorasPersSustInt,

            PersAdminNumPers          = e.PersAdminNumPers,
            PersAdminGastPers         = e.PersAdminGastPers,
            PersAdminHorasCp          = e.PersAdminHorasCp,
            PersAdminHorasCc          = e.PersAdminHorasCc,
            PersAdminHorasIt          = e.PersAdminHorasIt,
            PersAdminHorasAtep        = e.PersAdminHorasAtep,
            PersAdminHorasAgm         = e.PersAdminHorasAgm,
            PersAdminNumPersSustInt   = e.PersAdminNumPersSustInt,
            PersAdminGastPersSustInt  = e.PersAdminGastPersSustInt,
            PersAdminHorasPersSustInt = e.PersAdminHorasPersSustInt,

            PersTecPreNumPers          = e.PersTecPreNumPers,
            PersTecPreGastPers         = e.PersTecPreGastPers,
            PersTecPreHorasCp          = e.PersTecPreHorasCp,
            PersTecPreHorasCc          = e.PersTecPreHorasCc,
            PersTecPreHorasIt          = e.PersTecPreHorasIt,
            PersTecPreHorasAtep        = e.PersTecPreHorasAtep,
            PersTecPreHorasAgm         = e.PersTecPreHorasAgm,
            PersTecPreNumPersSustInt   = e.PersTecPreNumPersSustInt,
            PersTecPreGastPersSustInt  = e.PersTecPreGastPersSustInt,
            PersTecPreHorasPersSustInt = e.PersTecPreHorasPersSustInt,

            PersNoAdminNumPers          = e.PersNoAdminNumPers,
            PersNoAdminGastPers         = e.PersNoAdminGastPers,
            PersNoAdminHorasCp          = e.PersNoAdminHorasCp,
            PersNoAdminHorasCc          = e.PersNoAdminHorasCc,
            PersNoAdminHorasIt          = e.PersNoAdminHorasIt,
            PersNoAdminHorasAtep        = e.PersNoAdminHorasAtep,
            PersNoAdminHorasAgm         = e.PersNoAdminHorasAgm,
            PersNoAdminNumPersSustInt   = e.PersNoAdminNumPersSustInt,
            PersNoAdminGastPersSustInt  = e.PersNoAdminGastPersSustInt,
            PersNoAdminHorasPersSustInt = e.PersNoAdminHorasPersSustInt,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06DatosPlantillaDTO dto, Icg06 e)
        {
            e.PersSanitMedArt6NumPers          = dto.PersSanitMedArt6NumPers;
            e.PersSanitMedArt6GastPers         = dto.PersSanitMedArt6GastPers;
            e.PersSanitMedArt6HorasCp          = dto.PersSanitMedArt6HorasCp;
            e.PersSanitMedArt6HorasCc          = dto.PersSanitMedArt6HorasCc;
            e.PersSanitMedArt6HorasIt          = dto.PersSanitMedArt6HorasIt;
            e.PersSanitMedArt6HorasAtep        = dto.PersSanitMedArt6HorasAtep;
            e.PersSanitMedArt6HorasAgm         = dto.PersSanitMedArt6HorasAgm;
            e.PersSanitMedArt6NumPersSustInt   = dto.PersSanitMedArt6NumPersSustInt;
            e.PersSanitMedArt6GastPersSustInt  = dto.PersSanitMedArt6GastPersSustInt;
            e.PersSanitMedArt6HorasPersSustInt = dto.PersSanitMedArt6HorasPersSustInt;

            e.PersSanitMedEspArt6NumPers          = dto.PersSanitMedEspArt6NumPers;
            e.PersSanitMedEspArt6GastPers         = dto.PersSanitMedEspArt6GastPers;
            e.PersSanitMedEspArt6HorasCp          = dto.PersSanitMedEspArt6HorasCp;
            e.PersSanitMedEspArt6HorasCc          = dto.PersSanitMedEspArt6HorasCc;
            e.PersSanitMedEspArt6HorasIt          = dto.PersSanitMedEspArt6HorasIt;
            e.PersSanitMedEspArt6HorasAtep        = dto.PersSanitMedEspArt6HorasAtep;
            e.PersSanitMedEspArt6HorasAgm         = dto.PersSanitMedEspArt6HorasAgm;
            e.PersSanitMedEspArt6NumPersSustInt   = dto.PersSanitMedEspArt6NumPersSustInt;
            e.PersSanitMedEspArt6GastPersSustInt  = dto.PersSanitMedEspArt6GastPersSustInt;
            e.PersSanitMedEspArt6HorasPersSustInt = dto.PersSanitMedEspArt6HorasPersSustInt;

            e.PersSanitMedGesArt6NumPers          = dto.PersSanitMedGesArt6NumPers;
            e.PersSanitMedGesArt6GastPers         = dto.PersSanitMedGesArt6GastPers;
            e.PersSanitMedGesArt6HorasCp          = dto.PersSanitMedGesArt6HorasCp;
            e.PersSanitMedGesArt6HorasCc          = dto.PersSanitMedGesArt6HorasCc;
            e.PersSanitMedGesArt6HorasIt          = dto.PersSanitMedGesArt6HorasIt;
            e.PersSanitMedGesArt6HorasAtep        = dto.PersSanitMedGesArt6HorasAtep;
            e.PersSanitMedGesArt6HorasAgm         = dto.PersSanitMedGesArt6HorasAgm;
            e.PersSanitMedGesArt6NumPersSustInt   = dto.PersSanitMedGesArt6NumPersSustInt;
            e.PersSanitMedGesArt6GastPersSustInt  = dto.PersSanitMedGesArt6GastPersSustInt;
            e.PersSanitMedGesArt6HorasPersSustInt = dto.PersSanitMedGesArt6HorasPersSustInt;

            e.PersSanitArt7DuenumPers          = dto.PersSanitArt7DuenumPers;
            e.PersSanitArt7DuegastPers         = dto.PersSanitArt7DuegastPers;
            e.PersSanitArt7DuehorasCp          = dto.PersSanitArt7DuehorasCp;
            e.PersSanitArt7DuehorasCc          = dto.PersSanitArt7DuehorasCc;
            e.PersSanitArt7DuehorasIt          = dto.PersSanitArt7DuehorasIt;
            e.PersSanitArt7DuehorasAtep        = dto.PersSanitArt7DuehorasAtep;
            e.PersSanitArt7DuehorasAgm         = dto.PersSanitArt7DuehorasAgm;
            e.PersSanitArt7DuenumPersSustInt   = dto.PersSanitArt7DuenumPersSustInt;
            e.PersSanitArt7DuegastPersSustInt  = dto.PersSanitArt7DuegastPersSustInt;
            e.PersSanitArt7DuehorasPersSustInt = dto.PersSanitArt7DuehorasPersSustInt;

            e.PersSanitArt7FisNumPers          = dto.PersSanitArt7FisNumPers;
            e.PersSanitArt7FisGastPers         = dto.PersSanitArt7FisGastPers;
            e.PersSanitArt7FisHorasCp          = dto.PersSanitArt7FisHorasCp;
            e.PersSanitArt7FisHorasCc          = dto.PersSanitArt7FisHorasCc;
            e.PersSanitArt7FisHorasIt          = dto.PersSanitArt7FisHorasIt;
            e.PersSanitArt7FisHorasAtep        = dto.PersSanitArt7FisHorasAtep;
            e.PersSanitArt7FisHorasAgm         = dto.PersSanitArt7FisHorasAgm;
            e.PersSanitArt7FisNumPersSustInt   = dto.PersSanitArt7FisNumPersSustInt;
            e.PersSanitArt7FisGastPersSustInt  = dto.PersSanitArt7FisGastPersSustInt;
            e.PersSanitArt7FisHorasPersSustInt = dto.PersSanitArt7FisHorasPersSustInt;

            e.PersSanitArt7PsicoNumPers          = dto.PersSanitArt7PsicoNumPers;
            e.PersSanitArt7PsicoGastPers         = dto.PersSanitArt7PsicoGastPers;
            e.PersSanitArt7PsicoHorasCp          = dto.PersSanitArt7PsicoHorasCp;
            e.PersSanitArt7PsicoHorasCc          = dto.PersSanitArt7PsicoHorasCc;
            e.PersSanitArt7PsicoHorasIt          = dto.PersSanitArt7PsicoHorasIt;
            e.PersSanitArt7PsicoHorasAtep        = dto.PersSanitArt7PsicoHorasAtep;
            e.PersSanitArt7PsicoHorasAgm         = dto.PersSanitArt7PsicoHorasAgm;
            e.PersSanitArt7PsicoNumPersSustInt   = dto.PersSanitArt7PsicoNumPersSustInt;
            e.PersSanitArt7PsicoGastPersSustInt  = dto.PersSanitArt7PsicoGastPersSustInt;
            e.PersSanitArt7PsicoHorasPersSustInt = dto.PersSanitArt7PsicoHorasPersSustInt;

            e.PersSanitArt7TrSocNumPers          = dto.PersSanitArt7TrSocNumPers;
            e.PersSanitArt7TrSocGastPers         = dto.PersSanitArt7TrSocGastPers;
            e.PersSanitArt7TrSocHorasCp          = dto.PersSanitArt7TrSocHorasCp;
            e.PersSanitArt7TrSocHorasCc          = dto.PersSanitArt7TrSocHorasCc;
            e.PersSanitArt7TrSocHorasIt          = dto.PersSanitArt7TrSocHorasIt;
            e.PersSanitArt7TrSocHorasAtep        = dto.PersSanitArt7TrSocHorasAtep;
            e.PersSanitArt7TrSocHorasAgm         = dto.PersSanitArt7TrSocHorasAgm;
            e.PersSanitArt7TrSocNumPersSustInt   = dto.PersSanitArt7TrSocNumPersSustInt;
            e.PersSanitArt7TrSocGastPersSustInt  = dto.PersSanitArt7TrSocGastPersSustInt;
            e.PersSanitArt7TrSocHorasPersSustInt = dto.PersSanitArt7TrSocHorasPersSustInt;

            e.PersSanitArt7TerOcuNumPers          = dto.PersSanitArt7TerOcuNumPers;
            e.PersSanitArt7TerOcuGastPers         = dto.PersSanitArt7TerOcuGastPers;
            e.PersSanitArt7TerOcuHorasCp          = dto.PersSanitArt7TerOcuHorasCp;
            e.PersSanitArt7TerOcuHorasCc          = dto.PersSanitArt7TerOcuHorasCc;
            e.PersSanitArt7TerOcuHorasIt          = dto.PersSanitArt7TerOcuHorasIt;
            e.PersSanitArt7TerOcuHorasAtep        = dto.PersSanitArt7TerOcuHorasAtep;
            e.PersSanitArt7TerOcuHorasAgm         = dto.PersSanitArt7TerOcuHorasAgm;
            e.PersSanitArt7TerOcuNumPersSustInt   = dto.PersSanitArt7TerOcuNumPersSustInt;
            e.PersSanitArt7TerOcuGastPersSustInt  = dto.PersSanitArt7TerOcuGastPersSustInt;
            e.PersSanitArt7TerOcuHorasPersSustInt = dto.PersSanitArt7TerOcuHorasPersSustInt;

            e.PersSanitArt7TecRxnumPers          = dto.PersSanitArt7TecRxnumPers;
            e.PersSanitArt7TecRxgastPers         = dto.PersSanitArt7TecRxgastPers;
            e.PersSanitArt7TecRxhorasCp          = dto.PersSanitArt7TecRxhorasCp;
            e.PersSanitArt7TecRxhorasCc          = dto.PersSanitArt7TecRxhorasCc;
            e.PersSanitArt7TecRxhorasIt          = dto.PersSanitArt7TecRxhorasIt;
            e.PersSanitArt7TecRxhorasAtep        = dto.PersSanitArt7TecRxhorasAtep;
            e.PersSanitArt7TecRxhorasAgm         = dto.PersSanitArt7TecRxhorasAgm;
            e.PersSanitArt7TecRxnumPersSustInt   = dto.PersSanitArt7TecRxnumPersSustInt;
            e.PersSanitArt7TecRxgastPersSustInt  = dto.PersSanitArt7TecRxgastPersSustInt;
            e.PersSanitArt7TecRxhorasPersSustInt = dto.PersSanitArt7TecRxhorasPersSustInt;

            e.PersSanitArt7RestNumPers          = dto.PersSanitArt7RestNumPers;
            e.PersSanitArt7RestGastPers         = dto.PersSanitArt7RestGastPers;
            e.PersSanitArt7RestHorasCp          = dto.PersSanitArt7RestHorasCp;
            e.PersSanitArt7RestHorasCc          = dto.PersSanitArt7RestHorasCc;
            e.PersSanitArt7RestHorasIt          = dto.PersSanitArt7RestHorasIt;
            e.PersSanitArt7RestHorasAtep        = dto.PersSanitArt7RestHorasAtep;
            e.PersSanitArt7RestHorasAgm         = dto.PersSanitArt7RestHorasAgm;
            e.PersSanitArt7RestNumPersSustInt   = dto.PersSanitArt7RestNumPersSustInt;
            e.PersSanitArt7RestGastPersSustInt  = dto.PersSanitArt7RestGastPersSustInt;
            e.PersSanitArt7RestHorasPersSustInt = dto.PersSanitArt7RestHorasPersSustInt;

            e.PersSanitGradSupNumPers          = dto.PersSanitGradSupNumPers;
            e.PersSanitGradSupGastPers         = dto.PersSanitGradSupGastPers;
            e.PersSanitGradSupHorasCp          = dto.PersSanitGradSupHorasCp;
            e.PersSanitGradSupHorasCc          = dto.PersSanitGradSupHorasCc;
            e.PersSanitGradSupHorasIt          = dto.PersSanitGradSupHorasIt;
            e.PersSanitGradSupHorasAtep        = dto.PersSanitGradSupHorasAtep;
            e.PersSanitGradSupHorasAgm         = dto.PersSanitGradSupHorasAgm;
            e.PersSanitGradSupNumPersSustInt   = dto.PersSanitGradSupNumPersSustInt;
            e.PersSanitGradSupGastPersSustInt  = dto.PersSanitGradSupGastPersSustInt;
            e.PersSanitGradSupHorasPersSustInt = dto.PersSanitGradSupHorasPersSustInt;

            e.PersSanitGradMedAuxEnfNumPers          = dto.PersSanitGradMedAuxEnfNumPers;
            e.PersSanitGradMedAuxEnfGastPers         = dto.PersSanitGradMedAuxEnfGastPers;
            e.PersSanitGradMedAuxEnfHorasCp          = dto.PersSanitGradMedAuxEnfHorasCp;
            e.PersSanitGradMedAuxEnfHorasCc          = dto.PersSanitGradMedAuxEnfHorasCc;
            e.PersSanitGradMedAuxEnfHorasIt          = dto.PersSanitGradMedAuxEnfHorasIt;
            e.PersSanitGradMedAuxEnfHorasAtep        = dto.PersSanitGradMedAuxEnfHorasAtep;
            e.PersSanitGradMedAuxEnfHorasAgm         = dto.PersSanitGradMedAuxEnfHorasAgm;
            e.PersSanitGradMedAuxEnfNumPersSustInt   = dto.PersSanitGradMedAuxEnfNumPersSustInt;
            e.PersSanitGradMedAuxEnfGastPersSustInt  = dto.PersSanitGradMedAuxEnfGastPersSustInt;
            e.PersSanitGradMedAuxEnfHorasPersSustInt = dto.PersSanitGradMedAuxEnfHorasPersSustInt;

            e.PersSanitGradMedRestNumPers          = dto.PersSanitGradMedRestNumPers;
            e.PersSanitGradMedRestGastPers         = dto.PersSanitGradMedRestGastPers;
            e.PersSanitGradMedRestHorasCp          = dto.PersSanitGradMedRestHorasCp;
            e.PersSanitGradMedRestHorasCc          = dto.PersSanitGradMedRestHorasCc;
            e.PersSanitGradMedRestHorasIt          = dto.PersSanitGradMedRestHorasIt;
            e.PersSanitGradMedRestHorasAtep        = dto.PersSanitGradMedRestHorasAtep;
            e.PersSanitGradMedRestHorasAgm         = dto.PersSanitGradMedRestHorasAgm;
            e.PersSanitGradMedRestNumPersSustInt   = dto.PersSanitGradMedRestNumPersSustInt;
            e.PersSanitGradMedRestGastPersSustInt  = dto.PersSanitGradMedRestGastPersSustInt;
            e.PersSanitGradMedRestHorasPersSustInt = dto.PersSanitGradMedRestHorasPersSustInt;

            e.RestPersSanitNumPers          = dto.RestPersSanitNumPers;
            e.RestPersSanitGastPers         = dto.RestPersSanitGastPers;
            e.RestPersSanitHorasCp          = dto.RestPersSanitHorasCp;
            e.RestPersSanitHorasCc          = dto.RestPersSanitHorasCc;
            e.RestPersSanitHorasIt          = dto.RestPersSanitHorasIt;
            e.RestPersSanitHorasAtep        = dto.RestPersSanitHorasAtep;
            e.RestPersSanitHorasAgm         = dto.RestPersSanitHorasAgm;
            e.RestPersSanitNumPersSustInt   = dto.RestPersSanitNumPersSustInt;
            e.RestPersSanitGastPersSustInt  = dto.RestPersSanitGastPersSustInt;
            e.RestPersSanitHorasPersSustInt = dto.RestPersSanitHorasPersSustInt;

            e.PersDirCenNumPers          = dto.PersDirCenNumPers;
            e.PersDirCenGastPers         = dto.PersDirCenGastPers;
            e.PersDirCenHorasCp          = dto.PersDirCenHorasCp;
            e.PersDirCenHorasCc          = dto.PersDirCenHorasCc;
            e.PersDirCenHorasIt          = dto.PersDirCenHorasIt;
            e.PersDirCenHorasAtep        = dto.PersDirCenHorasAtep;
            e.PersDirCenHorasAgm         = dto.PersDirCenHorasAgm;
            e.PersDirCenNumPersSustInt   = dto.PersDirCenNumPersSustInt;
            e.PersDirCenGastPersSustInt  = dto.PersDirCenGastPersSustInt;
            e.PersDirCenHorasPersSustInt = dto.PersDirCenHorasPersSustInt;

            e.PersAdminNumPers          = dto.PersAdminNumPers;
            e.PersAdminGastPers         = dto.PersAdminGastPers;
            e.PersAdminHorasCp          = dto.PersAdminHorasCp;
            e.PersAdminHorasCc          = dto.PersAdminHorasCc;
            e.PersAdminHorasIt          = dto.PersAdminHorasIt;
            e.PersAdminHorasAtep        = dto.PersAdminHorasAtep;
            e.PersAdminHorasAgm         = dto.PersAdminHorasAgm;
            e.PersAdminNumPersSustInt   = dto.PersAdminNumPersSustInt;
            e.PersAdminGastPersSustInt  = dto.PersAdminGastPersSustInt;
            e.PersAdminHorasPersSustInt = dto.PersAdminHorasPersSustInt;

            e.PersTecPreNumPers          = dto.PersTecPreNumPers;
            e.PersTecPreGastPers         = dto.PersTecPreGastPers;
            e.PersTecPreHorasCp          = dto.PersTecPreHorasCp;
            e.PersTecPreHorasCc          = dto.PersTecPreHorasCc;
            e.PersTecPreHorasIt          = dto.PersTecPreHorasIt;
            e.PersTecPreHorasAtep        = dto.PersTecPreHorasAtep;
            e.PersTecPreHorasAgm         = dto.PersTecPreHorasAgm;
            e.PersTecPreNumPersSustInt   = dto.PersTecPreNumPersSustInt;
            e.PersTecPreGastPersSustInt  = dto.PersTecPreGastPersSustInt;
            e.PersTecPreHorasPersSustInt = dto.PersTecPreHorasPersSustInt;

            e.PersNoAdminNumPers          = dto.PersNoAdminNumPers;
            e.PersNoAdminGastPers         = dto.PersNoAdminGastPers;
            e.PersNoAdminHorasCp          = dto.PersNoAdminHorasCp;
            e.PersNoAdminHorasCc          = dto.PersNoAdminHorasCc;
            e.PersNoAdminHorasIt          = dto.PersNoAdminHorasIt;
            e.PersNoAdminHorasAtep        = dto.PersNoAdminHorasAtep;
            e.PersNoAdminHorasAgm         = dto.PersNoAdminHorasAgm;
            e.PersNoAdminNumPersSustInt   = dto.PersNoAdminNumPersSustInt;
            e.PersNoAdminGastPersSustInt  = dto.PersNoAdminGastPersSustInt;
            e.PersNoAdminHorasPersSustInt = dto.PersNoAdminHorasPersSustInt;
        }
    }
}
