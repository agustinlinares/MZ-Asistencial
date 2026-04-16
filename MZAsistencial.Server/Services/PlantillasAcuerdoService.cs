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
            return await _context.InformesAcuerdos
                .GroupJoin(_context.Mutuas,
                    ia => ia.MutuaId,
                    m => m.MutuaId,
                    (ia, mutuas) => new { ia, mutuas })
                .SelectMany(
                    x => x.mutuas.DefaultIfEmpty(),
                    (x, m) => new PlantillasAcuerdosDTO
                    {
                        Informe = x.ia.Informe,
                        EstadoInforme = x.ia.EstadoInformeId.ToString(),
                        TipoAcuerdo = x.ia.TipoAcuerdo,
                        Mutua = m != null ? m.Mutua1 : "Sin mutua",
                        Año = x.ia.Año,
                        Mes = x.ia.Mes,
                        Usuario = x.ia.UsuarioModificacion.ToString(),
                        FechaAlta = x.ia.FechaModificacion
                    })
                .ToListAsync();
        }

        public async Task<bool> CreatePlantillaAcuerdoAsync(PlantillasAcuerdosDTO dto)
        {
            var nuevoAcuerdo = new InformesAcuerdo
            {
                Informe = dto.Informe ?? "Nuevo Acuerdo",
                EstadoInformeId = int.TryParse(dto.EstadoInforme, out int idEstado) ? idEstado : 1,
                TipoAcuerdo = dto.TipoAcuerdo ?? "Bilateral",
                MutuaId = 1,
                Año = dto.Año ?? DateTime.Now.Year,
                Mes = dto.Mes ?? DateTime.Now.Month,
                UsuarioModificacion = 123,
                FechaModificacion = DateTime.Now
            };

            _context.InformesAcuerdos.Add(nuevoAcuerdo);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdatePlantillaAcuerdoAsync(int id, PlantillasAcuerdosDTO dto)
        {
            var acuerdo = await _context.InformesAcuerdos.FindAsync(id);
            if (acuerdo == null) return false;

            acuerdo.Informe = dto.Informe ?? acuerdo.Informe;
            if (int.TryParse(dto.EstadoInforme, out int nuevoEstadoId)) {
                acuerdo.EstadoInformeId = nuevoEstadoId;
            }
            acuerdo.TipoAcuerdo = dto.TipoAcuerdo ?? acuerdo.TipoAcuerdo;
            acuerdo.Año = dto.Año ?? acuerdo.Año;
            acuerdo.Mes = dto.Mes ?? acuerdo.Mes;
            acuerdo.UsuarioModificacion = 123;
            acuerdo.FechaModificacion = DateTime.Now;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeletePlantillaAcuerdoAsync(int id)
        {
            var acuerdo = await _context.InformesAcuerdos.FindAsync(id);
            if (acuerdo == null) return false;

            _context.InformesAcuerdos.Remove(acuerdo);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
