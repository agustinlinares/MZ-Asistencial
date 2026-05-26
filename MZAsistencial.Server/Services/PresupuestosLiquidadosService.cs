using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data; 
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public interface IPresupuestosLiquidadosService
    {
        Task<List<PresupuestosLiquidadosListDTO>> ObtenerTodosAsync();
        Task<int> InsertarAsync(PresupuestoLiquidadoFormDTO dto);
        Task<bool> ActualizarAsync(PresupuestoLiquidadoFormDTO dto);
        Task<PresupuestoLiquidadoFormDTO?> ObtenerPorIdAsync(int id);
        Task<bool> EliminarAsync(int id);
    }

    public class PresupuestosLiquidadosService : IPresupuestosLiquidadosService
    {
        private readonly MZAsistencialContext _context;

        public PresupuestosLiquidadosService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<List<PresupuestosLiquidadosListDTO>> ObtenerTodosAsync()
        {
            return await _context.MutuasPresupuesto
                .Join(_context.Mutuas, // Cruzamos con la tabla de mutuas existente
                    p => p.MutuaId,
                    m => m.MutuaId,
                    (p, m) => new { p, m }) // Agrupamos ambos objetos intermedios
                .Select(x => new PresupuestosLiquidadosListDTO
                {
                    IdPresupuesto = x.p.IdPresupuesto,
                    Año = x.p.Año,
                    MutuaId = x.p.MutuaId,
                    MutuaNombre = x.m.Mutua1 ?? "", // Extraemos el nombre real (Mutua1) de la tabla Mutuas
                    
                    TotalCentrosPropios = (x.p.PresupuestoCapitulo1Propio ?? 0) + 
                                        (x.p.PresupuestoCapitulo2Propio ?? 0) + 
                                        (x.p.PresupuestoCapitulo3Propio ?? 0) + 
                                        (x.p.PresupuestoGastosFinancieros ?? 0),

                    TotalCentrosConcertados = (x.p.PresupuestoCapitulo1Concertado ?? 0) + 
                                            (x.p.PresupuestoCapitulo2Concertado ?? 0) + 
                                            (x.p.PresupuestoArticulo2581 ?? 0) + 
                                            (x.p.PresupuestoArticulo2582 ?? 0) + 
                                            (x.p.PresupuestoArticulo25Resto ?? 0),

                    TotalOtrosConceptos = (x.p.PresupuestoCapitulo4Propio ?? 0) + 
                                        (x.p.PresupuestoCapitulo5Propio ?? 0) + 
                                        (x.p.PresupuestoCapitulo6Propio ?? 0),

                    TotalGeneral = ((x.p.PresupuestoCapitulo1Propio ?? 0) + (x.p.PresupuestoCapitulo2Propio ?? 0)) +
                                ((x.p.PresupuestoCapitulo1Concertado ?? 0) + (x.p.PresupuestoCapitulo2Concertado ?? 0) + (x.p.PresupuestoArticulo2581 ?? 0) + (x.p.PresupuestoArticulo2582 ?? 0) + (x.p.PresupuestoArticulo25Resto ?? 0)) +
                                ((x.p.PresupuestoCapitulo4Propio ?? 0) + (x.p.PresupuestoCapitulo5Propio ?? 0) + (x.p.PresupuestoCapitulo6Propio ?? 0))
                })
                .OrderBy(x => x.MutuaNombre).ThenBy(x => x.Año) // Ordenación semántica por nombre y ejercicio
                .ToListAsync();
        }

        public async Task<PresupuestoLiquidadoFormDTO?> ObtenerPorIdAsync(int id)
        {
            var p = await _context.MutuasPresupuesto.FindAsync(id);
            if (p == null) return null;

            return new PresupuestoLiquidadoFormDTO
            {
                IdPresupuesto = p.IdPresupuesto,
                Año = p.Año,
                MutuaId = p.MutuaId,
                PresupuestoCapitulo1Propio = p.PresupuestoCapitulo1Propio,
                PresupuestoCapitulo2Propio = p.PresupuestoCapitulo2Propio,
                PresupuestoGastosFinancieros = p.PresupuestoGastosFinancieros,
                PresupuestoCapitulo3Propio = p.PresupuestoCapitulo3Propio,
                PresupuestoCapitulo1Concertado = p.PresupuestoCapitulo1Concertado,
                PresupuestoCapitulo2Concertado = p.PresupuestoCapitulo2Concertado,
                PresupuestoArticulo2581 = p.PresupuestoArticulo2581,
                PresupuestoArticulo2582 = p.PresupuestoArticulo2582,
                PresupuestoArticulo25Resto = p.PresupuestoArticulo25Resto,
                PresupuestoCapitulo4Propio = p.PresupuestoCapitulo4Propio,
                PresupuestoCapitulo5Propio = p.PresupuestoCapitulo5Propio,
                PresupuestoCapitulo6Propio = p.PresupuestoCapitulo6Propio
            };
        }

        public async Task<int> InsertarAsync(PresupuestoLiquidadoFormDTO dto)
        {
            bool existe = await _context.MutuasPresupuesto
                .AnyAsync(m => m.MutuaId == dto.MutuaId && m.Año == dto.Año);

            if (existe) throw new InvalidOperationException("Ya existe un presupuesto para esta mutua y año.");

            var entidad = new MutuasPresupuesto
            {
                Año = dto.Año,
                MutuaId = dto.MutuaId,
                PresupuestoCapitulo1Propio = dto.PresupuestoCapitulo1Propio,
                PresupuestoCapitulo2Propio = dto.PresupuestoCapitulo2Propio,
                PresupuestoGastosFinancieros = dto.PresupuestoGastosFinancieros,
                PresupuestoCapitulo3Propio = dto.PresupuestoCapitulo3Propio,
                PresupuestoCapitulo1Concertado = dto.PresupuestoCapitulo1Concertado,
                PresupuestoCapitulo2Concertado = dto.PresupuestoCapitulo2Concertado,
                PresupuestoArticulo2581 = dto.PresupuestoArticulo2581,
                PresupuestoArticulo2582 = dto.PresupuestoArticulo2582,
                PresupuestoArticulo25Resto = dto.PresupuestoArticulo25Resto,
                PresupuestoCapitulo4Propio = dto.PresupuestoCapitulo4Propio,
                PresupuestoCapitulo5Propio = dto.PresupuestoCapitulo5Propio,
                PresupuestoCapitulo6Propio = dto.PresupuestoCapitulo6Propio
            };

            _context.MutuasPresupuesto.Add(entidad);
            
            // Guardamos para que SQL genere el Id_Presupuesto y poder registrarlo
            await _context.SaveChangesAsync();

            // Inserción en el Registro de Actividad 
            var log = new RegistroActividad
            {
                UsuarioId = 1, // TODO: Sustituir por el ID del usuario autenticado
                Fecha = DateTime.Now,
                Accion = $"Alta Presupuesto Liquidado. Mutua: {entidad.MutuaId}, Año: {entidad.Año}",
                Sql = $"INSERT INTO MutuasPresupuesto (Año, Mutua_id...) VALUES ('{entidad.Año}', {entidad.MutuaId}...)" 
            };

            _context.Set<RegistroActividad>().Add(log);
            await _context.SaveChangesAsync();

            return entidad.IdPresupuesto;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var entidad = await _context.MutuasPresupuesto.FindAsync(id);
            if (entidad == null) return false;

            _context.MutuasPresupuesto.Remove(entidad);

            // Inserción en el Registro de Actividad
            var log = new RegistroActividad
            {
                UsuarioId = 1, 
                Fecha = DateTime.Now,
                Accion = $"Baja Presupuesto Liquidado ID: {id} (Mutua: {entidad.MutuaId}, Año: {entidad.Año})",
                Sql = $"DELETE FROM MutuasPresupuesto WHERE Id_Presupuesto = {id}"
            };

            _context.Set<RegistroActividad>().Add(log);
            
            // Ejecutamos ambas operaciones (Remove y Add) en una sola transacción a la BD
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<bool> ActualizarAsync(PresupuestoLiquidadoFormDTO dto)
        {
            var entidad = await _context.MutuasPresupuesto.FindAsync(dto.IdPresupuesto);
            if (entidad == null) return false;

            entidad.PresupuestoCapitulo1Propio = dto.PresupuestoCapitulo1Propio;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}