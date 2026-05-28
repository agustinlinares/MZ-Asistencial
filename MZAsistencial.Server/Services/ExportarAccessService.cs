using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class ExportarAccessService : IExportarAccessService
    {
        private readonly MZAsistencialContext _context;
        private readonly IConfiguration _configuration;

        private static readonly Dictionary<int, string> TiposCentro = new()
        {
            [1] = "Propios",
            [2] = "Conciertos",
        };

        private static readonly Dictionary<int, string> Estados = new()
        {
            [1] = "Disponible",
        };

        public ExportarAccessService(MZAsistencialContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<IEnumerable<FicheroGeneradoDTO>> GetAllAsync()
        {
            var ficheros = await _context.FicherosGenerados.ToListAsync();
            var mutuas   = await _context.Mutuas.ToListAsync();
            var usuarios = await _context.Usuarios.ToListAsync();

            return ficheros.Select(fg =>
            {
                var mutuaId = fg.MutuaId?.Trim();
                var mutua   = mutuas.FirstOrDefault(m => m.NumeroMutua == mutuaId);
                var usuario = usuarios.FirstOrDefault(u => u.UsuarioId == fg.UsuarioAltaId);

                return new FicheroGeneradoDTO
                {
                    FicheroGeneradoId = fg.FicheroGeneradoId,
                    MutuaId           = mutuaId,
                    NumeroMutua       = mutua?.NumeroMutua,
                    NombreMutua       = mutua?.Mutua1,
                    Año               = fg.Año,
                    NombreFichero     = fg.FicheroGenerado,
                    UsuarioAltaId     = fg.UsuarioAltaId,
                    UsuarioAlta       = usuario?.Usuario1,
                    FechaAlta         = fg.FechaAlta,
                    HoraAlta          = fg.FechaAlta.HasValue ? fg.FechaAlta.Value.Hour : null,
                    EstadoId          = fg.EstadoId,
                    Estado            = fg.EstadoId.HasValue && Estados.TryGetValue(fg.EstadoId.Value, out var est) ? est : null,
                    TipoCentroId      = fg.TipoCentroId,
                    TipoCentro        = fg.TipoCentroId.HasValue && TiposCentro.TryGetValue(fg.TipoCentroId.Value, out var tipo) ? tipo : null,
                    TipoConciertoId   = fg.TipoConciertoId,
                };
            }).ToList();
        }

        public async Task<IEnumerable<Mutua>> GetMutuasAsync()
        {
            return await _context.Mutuas
                .OrderBy(m => m.NumeroMutua)
                .ToListAsync();
        }

        public async Task<IEnumerable<int>> GetAñosAsync()
        {
            return await _context.Ejercicios
                .OrderByDescending(e => e.Año)
                .Select(e => e.Año)
                .ToListAsync();
        }

        public async Task<FicheroGeneradoDTO> CreateAsync(int mutuaIntId, int año, int tipoCentroId, int usuarioId)
        {
            var mutua = await _context.Mutuas.FindAsync(mutuaIntId);

            var tipoCentroText = TiposCentro.TryGetValue(tipoCentroId, out var t) ? t : tipoCentroId.ToString();
            var numeroMutua    = mutua?.NumeroMutua?.Trim() ?? mutuaIntId.ToString();
            var nombreFichero  = $"{numeroMutua}_{año}_{tipoCentroText}.accdb";

            var fg = new FicherosGenerado
            {
                MutuaId       = numeroMutua,
                Año           = año,
                FicheroGenerado = nombreFichero,
                UsuarioAltaId = usuarioId,
                FechaAlta     = DateTime.Now,
                EstadoId      = 1,
                TipoCentroId  = tipoCentroId,
            };

            _context.FicherosGenerados.Add(fg);
            _context.RegistroActividads.Add(new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha     = DateTime.Now,
                Accion    = $"CREAR FICHERO ACCDB - {nombreFichero}",
                Sql       = $"Mutua: {numeroMutua}, Año: {año}, TipoCentro: {tipoCentroId}",
            });

            await _context.SaveChangesAsync();

            var usuario = await _context.Usuarios.FindAsync(usuarioId);

            return new FicheroGeneradoDTO
            {
                FicheroGeneradoId = fg.FicheroGeneradoId,
                MutuaId           = numeroMutua,
                NumeroMutua       = mutua?.NumeroMutua,
                NombreMutua       = mutua?.Mutua1,
                Año               = fg.Año,
                NombreFichero     = fg.FicheroGenerado,
                UsuarioAltaId     = fg.UsuarioAltaId,
                UsuarioAlta       = usuario?.Usuario1,
                FechaAlta         = fg.FechaAlta,
                HoraAlta          = fg.FechaAlta.HasValue ? fg.FechaAlta.Value.Hour : null,
                EstadoId          = fg.EstadoId,
                Estado            = "Disponible",
                TipoCentroId      = fg.TipoCentroId,
                TipoCentro        = tipoCentroText,
                TipoConciertoId   = fg.TipoConciertoId,
            };
        }

        public async Task<bool> DeleteAsync(int id, int usuarioId)
        {
            var fg = await _context.FicherosGenerados.FindAsync(id);
            if (fg == null) return false;

            var nombre = fg.FicheroGenerado;
            _context.FicherosGenerados.Remove(fg);
            _context.RegistroActividads.Add(new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha     = DateTime.Now,
                Accion    = $"ELIMINAR FICHERO ACCDB - {nombre}",
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(string? filePath, string? nombreFichero)> GetFilePathAsync(int id)
        {
            var fg = await _context.FicherosGenerados.FindAsync(id);
            if (fg == null || string.IsNullOrEmpty(fg.FicheroGenerado))
                return (null, null);

            var basePath = _configuration["AccdbPaths:Base"] ?? @"C:\MZFiles\AccdbFicheros";
            var filePath = Path.IsPathRooted(fg.FicheroGenerado)
                ? fg.FicheroGenerado
                : Path.Combine(basePath, fg.FicheroGenerado);

            return (filePath, fg.FicheroGenerado);
        }
    }
}
