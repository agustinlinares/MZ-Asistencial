using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Services;

namespace MZAsistencial.Server.Services
{
    public class Icg06AreaAsistencialService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public Icg06AreaAsistencialService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        public async Task<Icg06AreaAsistencialDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var entity = await _context.Icg06s
                .FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);

            if (entity is null) return null;

            return MapToDTO(entity);
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06AreaAsistencialDTO dto)
        {
            var entity = await _context.Icg06s.FindAsync(idIcg);
            if (entity is null) return false;

            MapToEntity(dto, entity);

            entity.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── Entity → DTO ────────────────────────────────────────────────────
        private static Icg06AreaAsistencialDTO MapToDTO(Icg06 e) => new()
        {
            IdIcg       = e.IdIcg,
            Año         = e.Año,
            CentroId    = e.CentroId,
            TipoHorario = e.TipoHorario,
            HorarioA    = e.HorarioA,
            HorarioDe   = e.HorarioDe,
            TraslNdirec = e.TraslNdirec,
            Numdiano    = e.Numdiano,
            Numdcierre  = e.Numdcierre,
            Numquirof   = e.Numquirof,
            Numcamas    = e.Numcamas,
            Hormande    = e.Hormande,
            Hormanha    = e.Hormanha,
            Hortardes   = e.Hortardes,
            Hortarhas   = e.Hortarhas,
        };

        // ─── DTO → Entity ────────────────────────────────────────────────────
        private static void MapToEntity(Icg06AreaAsistencialDTO dto, Icg06 e)
        {
            e.TipoHorario = dto.TipoHorario;
            e.HorarioA    = dto.HorarioA;
            e.HorarioDe   = dto.HorarioDe;
            e.TraslNdirec = dto.TraslNdirec;
            e.Numdiano    = dto.Numdiano;
            e.Numdcierre  = dto.Numdcierre;
            e.Numquirof   = dto.Numquirof;
            e.Numcamas    = dto.Numcamas;
            e.Hormande    = dto.Hormande;
            e.Hormanha    = dto.Hormanha;
            e.Hortardes   = dto.Hortardes;
            e.Hortarhas   = dto.Hortarhas;
        }
    }
}
