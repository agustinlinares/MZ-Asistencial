using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class PlantillasAcuerdoService : IPlantillasAcuerdoService
    {
        private readonly MZAsistencialContext _context;
        private readonly IConfiguration _configuration;

        private static readonly Dictionary<string, string> EstadoLabels = new()
        {
            { "1", "Pendiente" },
            { "2", "Procesado" },
        };

        private static readonly Dictionary<string, string> TipoAcuerdoLabels = new()
        {
            { "1", "Acuerdo 1 (Acuerdos mutua)" },
            { "2", "Acuerdo 2 (Acuerdo provincia)" },
            { "3", "Acuerdo 3 (Acuerdos tipo de servicio)" },
        };

        private static readonly Dictionary<int, string> TipoAcuerdoFolderKey = new()
        {
            { 1, "Acuerdo1" },
            { 2, "Acuerdo2" },
            { 3, "Acuerdo3" },
        };

        public PlantillasAcuerdoService(MZAsistencialContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<IEnumerable<PlantillasAcuerdosDTO>> GetPlantillasAcuerdosAsync()
        {
            return await _context.InformesIcgs
                .GroupJoin(_context.Mutuas,
                    ia => ia.MutuaId,
                    m => m.MutuaId,
                    (ia, mutuas) => new { ia, mutuas })
                .SelectMany(
                    x => x.mutuas.DefaultIfEmpty(),
                    (x, m) => new PlantillasAcuerdosDTO
                    {
                        Id = x.ia.InformeId,
                        Informe = x.ia.Informe,
                        EstadoInforme = x.ia.EstadoInformeId == 1 ? "Pendiente"
                                      : x.ia.EstadoInformeId == 2 ? "Procesado"
                                      : x.ia.EstadoInformeId.ToString(),
                        TipoAcuerdo = x.ia.TipoIcg == "1" ? "Acuerdo 1 (Acuerdos mutua)"
                                    : x.ia.TipoIcg == "2" ? "Acuerdo 2 (Acuerdo provincia)"
                                    : x.ia.TipoIcg == "3" ? "Acuerdo 3 (Acuerdos tipo de servicio)"
                                    : x.ia.TipoIcg ?? "Desconocido",
                        Mutua = m != null ? m.Mutua1 : "Sin mutua",
                        Año = x.ia.Año,
                        Mes = x.ia.Mes,
                        Usuario = x.ia.UsuarioModificación.ToString(),
                        FechaAlta = x.ia.FechaModificacion
                    })
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetMutuasAsync()
        {
            return await _context.Mutuas
                .Select(m => m.Mutua1 ?? "")
                .Where(m => m != "")
                .OrderBy(m => m)
                .ToListAsync();
        }

        public async Task<bool> CreatePlantillaAcuerdoAsync(PlantillaUploadDTO dto)
        {
            var mutua = await _context.Mutuas.FirstOrDefaultAsync(m => m.Mutua1 == dto.Mutua);

            var nuevoInforme = new InformesIcg
            {
                Informe = dto.File.FileName,
                EstadoInformeId = 1,
                TipoIcg = dto.TipoAcuerdoId?.ToString(),
                MutuaId = mutua?.MutuaId,
                Año = dto.Año ?? DateTime.Now.Year,
                Mes = DateTime.Now.Month,
                UsuarioModificación = int.TryParse(dto.Usuario, out int uid) ? uid : null,
                FechaModificacion = DateTime.Now
            };

            _context.InformesIcgs.Add(nuevoInforme);
            await _context.SaveChangesAsync(); // necesitamos el ID generado

            // Nombre único: nombreOriginal_id.xlsx
            var baseName = Path.GetFileNameWithoutExtension(dto.File.FileName);
            var uniqueName = $"{baseName}_{nuevoInforme.InformeId}.xlsx";

            // Carpeta física según tipo de acuerdo
            var folderKey = TipoAcuerdoFolderKey.TryGetValue(dto.TipoAcuerdoId ?? 0, out var key)
                ? key : "Acuerdo1";
            var folderPath = _configuration[$"AcuerdosPaths:{folderKey}"]
                ?? Path.Combine("C:\\MZFiles\\Acuerdos", folderKey);

            Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, uniqueName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            // Actualizar Informe con el nombre único definitivo
            nuevoInforme.Informe = uniqueName;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdatePlantillaAcuerdoAsync(int id, PlantillasAcuerdosDTO dto)
        {
            var acuerdo = await _context.InformesIcgs.FindAsync(id);
            if (acuerdo == null) return false;

            acuerdo.Informe = dto.Informe ?? acuerdo.Informe;
            if (int.TryParse(dto.EstadoInforme, out int nuevoEstadoId))
                acuerdo.EstadoInformeId = nuevoEstadoId;
            acuerdo.TipoIcg = dto.TipoAcuerdo ?? acuerdo.TipoIcg;
            acuerdo.Año = dto.Año ?? acuerdo.Año;
            acuerdo.Mes = dto.Mes ?? acuerdo.Mes;
            acuerdo.FechaModificacion = DateTime.Now;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeletePlantillaAcuerdoAsync(int id)
        {
            var acuerdo = await _context.InformesIcgs.FindAsync(id);
            if (acuerdo == null) return false;

            _context.InformesIcgs.Remove(acuerdo);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ProcessPlantillasAsync()
        {
            var pendientes = await _context.InformesIcgs
                .Where(i => i.EstadoInformeId == 1)
                .ToListAsync();

            if (!pendientes.Any()) return true;

            foreach (var informe in pendientes)
            {
                informe.EstadoInformeId = 2;
                informe.FechaModificacion = DateTime.Now;
            }

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
