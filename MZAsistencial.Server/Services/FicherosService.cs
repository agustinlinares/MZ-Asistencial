using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class FicherosService : IFicherosService
    {
        private readonly MZAsistencialContext _context;
        private readonly IConfiguration _configuration;

        public FicherosService(MZAsistencialContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<IEnumerable<FicheroDTO>> GetAllAsync()
        {
            return await _context.Ficheros
                .GroupJoin(_context.AuxAreas,
                    f => f.AreaId,
                    a => a.AreaId,
                    (f, areas) => new { f, areas })
                .SelectMany(
                    x => x.areas.DefaultIfEmpty(),
                    (x, a) => new FicheroDTO
                    {
                        FicheroId     = x.f.FicheroId,
                        NombreFichero = x.f.Fichero1,
                        Descripcion   = x.f.Descripción,
                        UsuarioId     = x.f.UsuarioId,
                        Fecha         = x.f.Fecha,
                        AreaId        = x.f.AreaId,
                        Area          = a != null ? a.Area : null,
                        FechaAlta     = x.f.FechaAlta,
                        UsuarioAltaId = x.f.UsuarioAltaId,
                    })
                .ToListAsync();
        }

        public async Task<IEnumerable<AuxArea>> GetAreasAsync()
        {
            return await _context.AuxAreas.ToListAsync();
        }

        public async Task<FicheroDTO> CreateAsync(string? descripcion, DateTime? fecha, int? areaId, IFormFile archivo, int usuarioId)
        {
            var basePath = _configuration["FicherosPaths:Base"] ?? @"C:\MZFiles\Ficheros";
            if (!Directory.Exists(basePath))
                Directory.CreateDirectory(basePath);

            var extension = Path.GetExtension(archivo.FileName);
            var uniqueName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(basePath, uniqueName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await archivo.CopyToAsync(stream);

            var fichero = new Fichero
            {
                Fichero1      = uniqueName,
                Descripción   = descripcion,
                UsuarioId     = usuarioId,
                Fecha         = fecha,
                AreaId        = areaId,
                FechaAlta     = DateTime.Now,
                UsuarioAltaId = usuarioId,
            };

            _context.Ficheros.Add(fichero);
            _context.RegistroActividads.Add(new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha     = DateTime.Now,
                Accion    = $"CREAR FICHERO - {archivo.FileName}",
                Sql       = $"Fichero: {uniqueName}, Area: {areaId}, Descripcion: {descripcion}",
            });

            await _context.SaveChangesAsync();

            return new FicheroDTO
            {
                FicheroId     = fichero.FicheroId,
                NombreFichero = fichero.Fichero1,
                Descripcion   = fichero.Descripción,
                UsuarioId     = fichero.UsuarioId,
                Fecha         = fichero.Fecha,
                AreaId        = fichero.AreaId,
                FechaAlta     = fichero.FechaAlta,
                UsuarioAltaId = fichero.UsuarioAltaId,
            };
        }

        public async Task<FicheroDTO?> UpdateAsync(int id, string? descripcion, DateTime? fecha, int? areaId, IFormFile? archivo, int usuarioId)
        {
            var fichero = await _context.Ficheros.FindAsync(id);
            if (fichero == null) return null;

            fichero.Descripción          = descripcion;
            fichero.Fecha                = fecha;
            fichero.AreaId               = areaId;
            fichero.FechaModificacion    = DateTime.Now;
            fichero.UsuarioModificacionId = usuarioId;

            if (archivo != null && archivo.Length > 0)
            {
                var basePath = _configuration["FicherosPaths:Base"] ?? @"C:\MZFiles\Ficheros";
                if (!Directory.Exists(basePath)) Directory.CreateDirectory(basePath);

                var oldPath = Path.Combine(basePath, fichero.Fichero1 ?? string.Empty);
                if (!string.IsNullOrEmpty(fichero.Fichero1) && File.Exists(oldPath))
                    File.Delete(oldPath);

                var extension = Path.GetExtension(archivo.FileName);
                var uniqueName = $"{Guid.NewGuid()}{extension}";
                var newPath = Path.Combine(basePath, uniqueName);
                using (var stream = new FileStream(newPath, FileMode.Create))
                    await archivo.CopyToAsync(stream);

                fichero.Fichero1 = uniqueName;
            }

            _context.RegistroActividads.Add(new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha     = DateTime.Now,
                Accion    = $"EDITAR FICHERO - {fichero.Fichero1}",
            });

            await _context.SaveChangesAsync();

            var area = fichero.AreaId.HasValue
                ? await _context.AuxAreas.FindAsync(fichero.AreaId.Value)
                : null;

            return new FicheroDTO
            {
                FicheroId     = fichero.FicheroId,
                NombreFichero = fichero.Fichero1,
                Descripcion   = fichero.Descripción,
                UsuarioId     = fichero.UsuarioId,
                Fecha         = fichero.Fecha,
                AreaId        = fichero.AreaId,
                Area          = area?.Area,
                FechaAlta     = fichero.FechaAlta,
                UsuarioAltaId = fichero.UsuarioAltaId,
            };
        }

        public async Task<bool> DeleteAsync(int id, int usuarioId)
        {
            var fichero = await _context.Ficheros.FindAsync(id);
            if (fichero == null) return false;

            var basePath = _configuration["FicherosPaths:Base"] ?? @"C:\MZFiles\Ficheros";
            var filePath = Path.Combine(basePath, fichero.Fichero1 ?? string.Empty);

            if (!string.IsNullOrEmpty(fichero.Fichero1) && File.Exists(filePath))
                File.Delete(filePath);

            var nombre = fichero.Fichero1;

            _context.Ficheros.Remove(fichero);
            _context.RegistroActividads.Add(new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha     = DateTime.Now,
                Accion    = $"ELIMINAR FICHERO - {nombre}",
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(string? filePath, string? nombreFichero)> GetFilePathAsync(int id, int usuarioId)
        {
            var fichero = await _context.Ficheros.FindAsync(id);
            if (fichero == null || string.IsNullOrEmpty(fichero.Fichero1))
                return (null, null);

            string filePath;
            if (Path.IsPathRooted(fichero.Fichero1))
                filePath = fichero.Fichero1;
            else
            {
                var basePath = _configuration["FicherosPaths:Base"] ?? @"C:\MZFiles\Ficheros";
                filePath = Path.Combine(basePath, fichero.Fichero1);
            }

            if (File.Exists(filePath))
            {
                _context.RegistroActividads.Add(new RegistroActividad
                {
                    UsuarioId = usuarioId,
                    Fecha     = DateTime.Now,
                    Accion    = $"DESCARGAR FICHERO - {fichero.Fichero1}",
                });
                await _context.SaveChangesAsync();
            }

            return (filePath, fichero.Descripción ?? fichero.Fichero1);
        }
    }
}
