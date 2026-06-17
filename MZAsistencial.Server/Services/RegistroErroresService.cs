using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class RegistroErroresService : IRegistroErroresService
    {
        private readonly MZAsistencialContext _context;

        public RegistroErroresService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task LogErrorAsync(Exception ex, string modulo, int? usuarioId = null)
        {
            string descripcion = $"[{modulo}] {ex.Message}";
            await LogInternalAsync(descripcion, usuarioId, ex.StackTrace, modulo);
        }

        public async Task LogErrorStringAsync(string descripcion, string modulo, int? usuarioId = null)
        {
            string msg = $"[{modulo}] {descripcion}";
            await LogInternalAsync(msg, usuarioId, null, modulo);
        }

        private async Task LogInternalAsync(string descripcion, int? usuarioId, string? stackTrace, string modulo = "React Client")
        {
            try
            {
                // Limitar tamaño para no exceder columnas si fuera necesario (asumiendo varchar(max) pero por precaución)
                if (descripcion.Length > 2000) descripcion = descripcion.Substring(0, 2000);
                
                var registro = new RegistroErrore
                {
                    UsuarioId = usuarioId,
                    FechaError = DateTime.Now,
                    Descripcion = descripcion,
                    FicheroLog = null,
                    EstadoId = 1, // 1 = Abierto
                    Comentarios = stackTrace ?? "Sin detalles adicionales",
                    Nombre_Modulo = modulo
                };

                _context.RegistroErrores.Add(registro);
                await _context.SaveChangesAsync();
            }
            catch
            {
                // Fallback silencioso: no interrumpir flujo si falla el log
            }
        }

        public IQueryable<RegistroErrorDTO> ObtenerListadoErroresQuery()
        {
            var query = from r in _context.RegistroErrores
                        join u in _context.Usuarios on r.UsuarioId equals u.UsuarioId into gjU
                        from subU in gjU.DefaultIfEmpty()
                        join m in _context.Mutuas on subU.MutuaId equals m.MutuaId into gjM
                        from subM in gjM.DefaultIfEmpty()
                        select new RegistroErrorDTO
                        {
                            ErrorId = r.ErrorId,
                            Usuario = subU != null ? subU.Usuario1 : "Desconocido",
                            Mutua = subM != null ? subM.Mutua1 : "ADMINISTRADOR",
                            FechaError = r.FechaError,
                            FicheroLog = r.FicheroLog,
                            Descripcion = r.Descripcion,
                            Estado = r.EstadoId == 1 ? "Abierto" : 
                                     r.EstadoId == 2 ? "En curso" : 
                                     r.EstadoId == 3 ? "Cerrado" : "Abierto"
                        };

            return query;
        }

        public async Task<bool> UpdateEstadoAsync(int errorId, int nuevoEstadoId)
        {
            var registro = await _context.RegistroErrores.FindAsync(errorId);
            if (registro == null) return false;

            registro.EstadoId = nuevoEstadoId;
            await _context.SaveChangesAsync();
            return true;
        }

        // Añade este método nuevo en tu servicio
        public async Task RegistrarErrorCompletoAsync(CrearRegistroErrorDTO dto)
        {
            await LogInternalAsync(dto.Descripcion, dto.UsuarioId, dto.DetalleError + "\n" + dto.Comentarios, dto.Nombre_Modulo);
        }

    }
}
