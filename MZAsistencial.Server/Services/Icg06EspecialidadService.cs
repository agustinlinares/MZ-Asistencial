using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class Icg06EspecialidadService
    {
        private readonly MZAsistencialContext _context;

        public Icg06EspecialidadService(MZAsistencialContext context)
        {
            _context = context;
        }

        // ─── GET: lista por centro y año ──────────────────────────────────────
        public async Task<List<Icg06EspecialidadDTO>> GetByCentroYAñoAsync(int centroId, int año)
        {
            return await _context.CentrosPropiosEspecialidades
                .Where(x => x.CentroId == centroId && x.Año == año)
                .OrderBy(x => x.CentroPropioEspecialidadId)
                .Select(x => new Icg06EspecialidadDTO
                {
                    Id                            = x.CentroPropioEspecialidadId,
                    CentroId                      = x.CentroId,
                    Año                           = x.Año,
                    EspecialidadId                = x.EspecialidadId,
                    Servicio                      = x.Servicio,
                    Cantidad                      = x.Cantidad,
                    ImporteConIva                 = (float?)x.ImporteConIva,
                    ServicioId                    = x.ServicioId,
                    FechaAlta                     = x.FechaAlta,
                    FechaBaja                     = x.FechaBaja,
                    Disponibilidad                = x.Disponibilidad,
                    Plazo                         = x.Plazo,
                    ActualizarDisponibilidad      = x.ActualizarDisponibilidad,
                    FechaModificacion             = x.FechaModificacion,
                    FechaActualizarDisponibilidad = x.FechaActualizarDisponibilidad,
                    FechaGeneracionAcreditacion   = x.FechaGeneracionAcreditacion,
                })
                .ToListAsync();
        }

        // ─── POST: crear nueva especialidad ───────────────────────────────────
        public async Task<Icg06EspecialidadDTO> CreateAsync(Icg06EspecialidadDTO dto, int? usuarioId = null)
        {
            var entity = new CentrosPropiosEspecialidade
            {
                CentroId                    = dto.CentroId,
                Año                         = dto.Año,
                EspecialidadId              = dto.EspecialidadId,
                Servicio                    = dto.Servicio ?? string.Empty,
                Cantidad                    = dto.Cantidad,
                ImporteConIva               = 0.0,
                ServicioId                  = dto.ServicioId,
                FechaAlta                   = DateTime.Now,
                Disponibilidad              = 1,
                Plazo                       = dto.Plazo,
                ActualizarDisponibilidad    = dto.ActualizarDisponibilidad,
                FechaGeneracionAcreditacion = dto.FechaGeneracionAcreditacion,
            };

            _context.CentrosPropiosEspecialidades.Add(entity);
            await _context.SaveChangesAsync();

            await RegistrarActividadAsync(
                usuarioId,
                $"INSERT Especialidad Centro {dto.CentroId} Año {dto.Año}",
                $"INSERT INTO CentrosPropiosEspecialidades (Centro_id, Año, Especialidad_id, Servicio, FechaAlta, Disponibilidad) VALUES ({dto.CentroId}, {dto.Año}, {dto.EspecialidadId}, '{dto.Servicio}', '{DateTime.Now}', 1)"
            );

            dto.Id        = entity.CentroPropioEspecialidadId;
            dto.FechaAlta = entity.FechaAlta;
            return dto;
        }

        // ─── PUT: actualizar especialidad ─────────────────────────────────────
        public async Task<bool> UpdateAsync(int id, Icg06EspecialidadDTO dto)
        {
            var entity = await _context.CentrosPropiosEspecialidades.FindAsync(id);
            if (entity is null) return false;

            entity.EspecialidadId                = dto.EspecialidadId;
            entity.Servicio                      = dto.Servicio ?? string.Empty;
            entity.Cantidad                      = dto.Cantidad;
            entity.ImporteConIva                 = dto.ImporteConIva;
            entity.ServicioId                    = dto.ServicioId;
            entity.FechaBaja                     = dto.FechaBaja;
            entity.Disponibilidad                = dto.Disponibilidad;
            entity.Plazo                         = dto.Plazo;
            entity.ActualizarDisponibilidad      = dto.ActualizarDisponibilidad;
            entity.FechaModificacion             = DateTime.Now;
            entity.FechaActualizarDisponibilidad = dto.FechaActualizarDisponibilidad;
            entity.FechaGeneracionAcreditacion   = dto.FechaGeneracionAcreditacion;

            await _context.SaveChangesAsync();
            return true;
        }

        // ─── DELETE: eliminar especialidad ────────────────────────────────────
        // FIX: se añade registro de actividad, igual que el original VB
        public async Task<bool> DeleteAsync(int id, int? usuarioId = null)
        {
            var entity = await _context.CentrosPropiosEspecialidades.FindAsync(id);
            if (entity is null) return false;

            _context.CentrosPropiosEspecialidades.Remove(entity);
            await _context.SaveChangesAsync();

            await RegistrarActividadAsync(
                usuarioId,
                $"DELETE Especialidad {id} Centro {entity.CentroId}",
                $"DELETE FROM CentrosPropiosEspecialidades WHERE CentroPropioEspecialidad_id={id}"
            );

            return true;
        }

        // ─── Registro de actividad ────────────────────────────────────────────
        private async Task RegistrarActividadAsync(int? usuarioId, string accion, string sql)
        {
            _context.RegistroActividads.Add(new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha     = DateTime.Now,
                Accion    = accion,
                Sql       = sql
            });
            await _context.SaveChangesAsync();
        }
    }
}