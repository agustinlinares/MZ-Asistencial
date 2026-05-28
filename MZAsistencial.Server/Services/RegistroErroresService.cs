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
            await LogInternalAsync(descripcion, usuarioId, ex.StackTrace);
        }

        public async Task LogErrorStringAsync(string descripcion, string modulo, int? usuarioId = null)
        {
            string msg = $"[{modulo}] {descripcion}";
            await LogInternalAsync(msg, usuarioId, null);
        }

        private async Task LogInternalAsync(string descripcion, int? usuarioId, string? stackTrace)
        {
            try
            {
                // Limitar tamaño para no exceder columnas si fuera necesario (asumiendo varchar(max) pero por precaución)
                if (descripcion.Length > 2000) descripcion = descripcion.Substring(0, 2000);
                
                string ficheroLogName = stackTrace == null 
                    ? $"LOG_{DateTime.Now:yyyy_MM_dd_HH_mm_ss}.txt" 
                    : $"C:\\Ficheros\\Errores\\LOG_{DateTime.Now:yyyy_MM_dd_HH_mm_ss}.txt";

                var registro = new RegistroErrore
                {
                    UsuarioId = usuarioId,
                    FechaError = DateTime.Now,
                    Descripcion = descripcion,
                    FicheroLog = ficheroLogName,
                    EstadoId = 1, // 1 = Abierto
                    Comentarios = stackTrace // Guardamos el stack trace en comentarios por si acaso
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
                            Usuario = subU.Usuario1,
                            Mutua = subU.MutuaId == null ? "ADMINISTRADOR" : subM.Mutua1,
                            FechaError = r.FechaError,
                            FicheroLog = r.FicheroLog,
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
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
