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
            await LogInternalAsync(ex.Message, usuarioId, ex.StackTrace, modulo);
        }

        public async Task LogErrorStringAsync(string descripcion, string modulo, int? usuarioId = null, string? stackTrace = null)
        {
            await LogInternalAsync(descripcion, usuarioId, stackTrace, modulo);
        }

        private async Task LogInternalAsync(string descripcion, int? usuarioId, string? stackTrace, string modulo)
        {
            try
            {
                if (descripcion.Length > 2000) descripcion = descripcion.Substring(0, 2000);
                
                var registro = new RegistroErrore
                {
                    UsuarioId = usuarioId,
                    FechaError = DateTime.Now,
                    Descripcion = descripcion,
                    NombreModulo = modulo, 
                    EstadoId = 1,
                    Comentarios = stackTrace 
                };

                _context.RegistroErrores.Add(registro);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR CRÍTICO AL GUARDAR LOG: {ex.Message}");
                if (ex.InnerException != null) 
                    Console.WriteLine($"DETALLE SQL: {ex.InnerException.Message}");
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
                            Usuario = subU.Usuario1,
                            Mutua = subU.MutuaId == null ? "ADMINISTRADOR" : subM.Mutua1,
                            FechaError = r.FechaError,
                            Modulo = r.NombreModulo,
                            Descripcion = r.Descripcion,
                            Estado = r.EstadoId == 1 ? "Abierto" : 
                                    r.EstadoId == 2 ? "En curso" : 
                                    r.EstadoId == 3 ? "Resuelto" : "Abierto"
                        };

            return query;
        }

        public async Task<bool> UpdateEstadoAsync(int errorId, int nuevoEstadoId)
        {
            var registro = await _context.RegistroErrores.FindAsync(errorId);
            if (registro == null) return false;

            registro.EstadoId = nuevoEstadoId;
            
            if (nuevoEstadoId == 3)
            {
                registro.FechaResolucion = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
