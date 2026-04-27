using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class PlantillasAcuerdoService : IPlantillasAcuerdoService
    {
        private readonly MZAsistencialContext _context;

        public PlantillasAcuerdoService(MZAsistencialContext context)
        {
            _context = context;
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
                        EstadoInforme = x.ia.EstadoInformeId.ToString(),
                        TipoAcuerdo = x.ia.TipoIcg,
                        Mutua = m != null ? m.Mutua1 : "Sin mutua",
                        Año = x.ia.Año,
                        Mes = x.ia.Mes,
                        Usuario = x.ia.UsuarioModificación.ToString(),
                        FechaAlta = x.ia.FechaModificacion
                    })
                .ToListAsync();
        }

        public async Task<bool> CreatePlantillaAcuerdoAsync(PlantillaUploadDTO dto)
        {
            // Buscar ID de mutua
            var mutua = await _context.Mutuas.FirstOrDefaultAsync(m => m.Mutua1 == dto.Mutua);

            var nuevoInforme = new InformesIcg
            {
                Informe = dto.File?.FileName ?? "Sin Fichero",
                EstadoInformeId = 1, // Estado inicial siempre 1
                TipoIcg = dto.TipoAcuerdoId?.ToString() ?? "Desconocido",
                MutuaId = mutua?.MutuaId,
                Año = dto.Año ?? DateTime.Now.Year,
                Mes = dto.Mes ?? DateTime.Now.Month,
                UsuarioModificación = int.TryParse(dto.Usuario, out int uid) ? uid : null,
                FechaModificacion = DateTime.Now
            };

            _context.InformesIcgs.Add(nuevoInforme);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdatePlantillaAcuerdoAsync(int id, PlantillasAcuerdosDTO dto)
        {
            var acuerdo = await _context.InformesIcgs.FindAsync(id);
            if (acuerdo == null) return false;

            acuerdo.Informe = dto.Informe ?? acuerdo.Informe;
            if (int.TryParse(dto.EstadoInforme, out int nuevoEstadoId)) {
                acuerdo.EstadoInformeId = nuevoEstadoId;
            }
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
            var informesPendientes = await _context.InformesIcgs
                .Where(i => i.EstadoInformeId == 1)
                .ToListAsync();

            if (!informesPendientes.Any()) return true; // Nada que procesar

            foreach (var informe in informesPendientes)
            {
                informe.EstadoInformeId = 2; // Cambiamos a estado procesado (2)
                informe.FechaModificacion = DateTime.Now;
            }

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
