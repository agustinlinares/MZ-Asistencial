using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public class IcgConciertosService
    {
        private readonly MZAsistencialContext _context;

        public IcgConciertosService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteIcgAsync(int idIcg)
        {
            // Busca la entidad por su Primary Key
            var registro = await _context.Icg07s.FindAsync(idIcg);
            
            if (registro == null) return false;

            // Borrado de la tabla ICG07
            _context.Icg07s.Remove(registro);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<List<IcgConciertoDto>> GetAllAsync()
        {
            return await (
                from icg in _context.Icg07s.AsNoTracking()
                join concierto in _context.Conciertos.AsNoTracking()
                    on icg.ConciertoId equals concierto.ConciertoId
                join centro in _context.CentrosConcertados.AsNoTracking()
                    on concierto.CentroId equals centro.CentroId
                join mutua in _context.Mutuas.AsNoTracking()
                    on concierto.MutuaId equals mutua.MutuaId
                join poblacion in _context.AuxPoblaciones.AsNoTracking()
                    on centro.PoblacionId equals poblacion.PoblacionId into poblacionJoin
                from poblacion in poblacionJoin.DefaultIfEmpty()
                join provincia in _context.AuxProvincias.AsNoTracking()
                    on poblacion.ProvinciaId equals provincia.ProvinciaId into provinciaJoin
                from provincia in provinciaJoin.DefaultIfEmpty()
                orderby icg.IdIcg descending
                select new IcgConciertoDto
                {
                    Id_Icg = icg.IdIcg,
                    Localizador = concierto.Localizador ?? centro.Localizador ?? string.Empty,
                    Concierto_id = icg.ConciertoId,
                    CodCASA = concierto.CodigoCasa ?? string.Empty,
                    Mutua = mutua.Mutua1 ?? string.Empty,
                    Centro_id = concierto.CentroId,
                    Centro = centro.Centro ?? string.Empty,
                    Poblacion = poblacion.Poblacion ?? string.Empty,
                    Provincia = icg.Provincia ?? provincia.Provincia ?? string.Empty,
                    AsistenciaSanitaria = icg.Costeassan ?? 0,
                    IncapacidadTemp = icg.CosteIt ?? 0,
                    Gastos = icg.GastoCentroNoConcert ?? 0,
                    Articulo25 = (icg.Art2581 ?? 0) + (icg.Art2582 ?? 0) + (icg.RestoArticulo25Scon ?? 0),
                    Total = (icg.Costeassan ?? 0) + (icg.CosteIt ?? 0) + (icg.GastoCentroNoConcert ?? 0),
                    Confirmar = icg.Validado ?? false
                }
            ).ToListAsync();
        }
    }
}
