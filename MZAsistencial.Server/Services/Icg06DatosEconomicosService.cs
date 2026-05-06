using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class Icg06DatosEconomicosService
    {
        private readonly MZAsistencialContext _context;

        public Icg06DatosEconomicosService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<Icg06DatosEconomicosDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06DatosEconomicosDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);
            entity.FechaModificacion = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06DatosEconomicosDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg    = e.IdIcg,
            Año      = e.Año,
            CentroId = e.CentroId,

            GasfinAscp = e.GasfinAscp,
            GasfinAscc = e.GasfinAscc,
            GasfinCit  = e.GasfinCit,
            GasfinPss  = e.GasfinPss,
            GasfinAg   = e.GasfinAg,

            GasbienescysAscp = e.GasbienescysAscp,
            GasbienescysAscc = e.GasbienescysAscc,
            GasbienescysCit  = e.GasbienescysCit,
            GasbienescysPss  = e.GasbienescysPss,
            GasbienescysAg   = e.GasbienescysAg,

            AmortizAscp = e.AmortizAscp,
            AmortizAscc = e.AmortizAscc,
            AmortizCit  = e.AmortizCit,
            AmortizPss  = e.AmortizPss,
            AmortizAg   = e.AmortizAg,

            InversionesNuevas     = e.InversionesNuevas,
            InversionesReposicion = e.InversionesReposicion,

            Factejercsist       = e.Factejercsist,
            Factejercresto      = e.Factejercresto,
            FactejerotrmutuasCp = e.FactejerotrmutuasCp,
            FactejerotrmutuasCc = e.FactejerotrmutuasCc,
            Factpendcobro       = e.Factpendcobro,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06DatosEconomicosDTO dto, Icg06 e)
        {
            e.GasfinAscp = dto.GasfinAscp;
            e.GasfinAscc = dto.GasfinAscc;
            e.GasfinCit  = dto.GasfinCit;
            e.GasfinPss  = dto.GasfinPss;
            e.GasfinAg   = dto.GasfinAg;

            e.GasbienescysAscp = dto.GasbienescysAscp;
            e.GasbienescysAscc = dto.GasbienescysAscc;
            e.GasbienescysCit  = dto.GasbienescysCit;
            e.GasbienescysPss  = dto.GasbienescysPss;
            e.GasbienescysAg   = dto.GasbienescysAg;

            e.AmortizAscp = dto.AmortizAscp;
            e.AmortizAscc = dto.AmortizAscc;
            e.AmortizCit  = dto.AmortizCit;
            e.AmortizPss  = dto.AmortizPss;
            e.AmortizAg   = dto.AmortizAg;

            e.InversionesNuevas     = dto.InversionesNuevas;
            e.InversionesReposicion = dto.InversionesReposicion;

            e.Factejercsist       = dto.Factejercsist;
            e.Factejercresto      = dto.Factejercresto;
            e.FactejerotrmutuasCp = dto.FactejerotrmutuasCp;
            e.FactejerotrmutuasCc = dto.FactejerotrmutuasCc;
            e.Factpendcobro       = dto.Factpendcobro;
        }
    }
}
