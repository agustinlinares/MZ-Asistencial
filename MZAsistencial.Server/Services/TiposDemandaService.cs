using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class TiposDemandaService : ITiposDemandaService
    {
        private readonly MZAsistencialContext _context;

        public TiposDemandaService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TipoDemandaDTO>> GetAllAsync()
        {
            var query = from td in _context.TiposDemanda
                        join aux in _context.AuxTiposDemanda on td.TipoId equals aux.TipoId into auxGroup
                        from aux in auxGroup.DefaultIfEmpty()
                        select new TipoDemandaDTO
                        {
                            TipoDemandaId = td.TipoDemandaId,
                            Año = td.Año,
                            Nombre = td.TipoDemanda != null ? td.TipoDemanda.Trim() : "",
                            PeriodoDesde = td.PeriodoDesde,
                            PeriodoHasta = td.PeriodoHasta,
                            Activo = td.ActivaId == 1,
                            TipoId = td.TipoId,
                            TipoDescripcion = aux != null && aux.Tipo != null ? aux.Tipo.Trim() : "Sin tipo"
                        };

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<AuxTipoDemandaDTO>> GetAuxTiposAsync()
        {
            return await _context.AuxTiposDemanda
                .Select(a => new AuxTipoDemandaDTO
                {
                    TipoId = a.TipoId,
                    Tipo = a.Tipo != null ? a.Tipo.Trim() : ""
                })
                .ToListAsync();
        }

        public async Task<TipoDemandaDTO> CreateAsync(TipoDemandaDTO dto)
        {
            var nuevaDemanda = new TiposDemandum
            {
                Año = dto.Año,
                TipoDemanda = dto.Nombre,
                PeriodoDesde = dto.PeriodoDesde,
                PeriodoHasta = dto.PeriodoHasta,
                ActivaId = dto.Activo ? 1 : 0,
                TipoId = dto.TipoId,
                FechaModificacion = DateTime.Now
            };

            _context.TiposDemanda.Add(nuevaDemanda);
            await _context.SaveChangesAsync();

            dto.TipoDemandaId = nuevaDemanda.TipoDemandaId;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, TipoDemandaDTO dto)
        {
            var existente = await _context.TiposDemanda.FindAsync(id);
            if (existente == null) return false;

            existente.Año = dto.Año;
            existente.TipoDemanda = dto.Nombre;
            existente.PeriodoDesde = dto.PeriodoDesde;
            existente.PeriodoHasta = dto.PeriodoHasta;
            existente.ActivaId = dto.Activo ? 1 : 0;
            existente.TipoId = dto.TipoId;
            existente.FechaModificacion = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                var mensajeReal = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                throw new Exception($"Fallo SQL al actualizar Tipo Demanda: {mensajeReal}");
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existente = await _context.TiposDemanda.FindAsync(id);
            if (existente == null) return false;

            _context.TiposDemanda.Remove(existente);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}