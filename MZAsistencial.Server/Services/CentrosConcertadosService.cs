using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface ICentrosConcertadosService
    {
        Task<IEnumerable<CentrosConcertadoDTO>> GetCabecerasAsync();
        Task<CentrosConcertadoDTO> CreateCentroAsync(CentrosConcertadoDTO dto);
        Task<bool> UpdateCentroAsync(int id, CentrosConcertadoDTO dto);
        Task<IEnumerable<MutuaAsignadaDTO>> GetMutuasPorCentroAsync(int centroId);
        Task<IEnumerable<EspecialidadesConciertoDTO>> GetEspecialidadesByCentroAsync(int centroId);
        Task<bool> DeleteCentroAsync(int id);
        Task ReactivarCentroAsync(int id);
    }

    public class CentrosConcertadosService : ICentrosConcertadosService
    {
        private readonly MZAsistencialContext _context;

        public CentrosConcertadosService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CentrosConcertadoDTO>> GetCabecerasAsync()
        {
            var query = from c in _context.CentrosConcertados
                        
                        // Left Join con Poblaciones
                        join p in _context.AuxPoblaciones on c.PoblacionId equals p.PoblacionId into pGroup
                        from p in pGroup.DefaultIfEmpty()
                        
                        // Left Join con Provincias (a través de la población o del centro)
                        join pr in _context.AuxProvincias on p.ProvinciaId equals pr.ProvinciaId into prGroup
                        from pr in prGroup.DefaultIfEmpty()

                        select new CentrosConcertadoDTO
                        {
                            Ccn = c.CodigoMz,      
                            Cif = c.Cifnif,        
                            Centro_id = c.CentroId, 
                            Centro = c.Centro,
                            Direccion = c.Direccion,
                            CP = c.Cp,

                            // Espacios limpios con Trim()
                            Poblacion = (p != null && p.Poblacion != null) ? p.Poblacion.Trim() : "Sin población",
                            Provincia = pr != null ? pr.Provincia.Trim() : "Sin provincia",

                            // IDs necesarios para React
                            ProvinciaId = pr.ProvinciaId, 
                            PoblacionId = c.PoblacionId,
                            ProveedorId = c.ProveedorId,
                            DelegacionId = c.DelegacionId,

                            // Resto de datos de la ficha
                            Telefono = c.Telefono,
                            FechaAlta = c.FechaAlta,
                            FechaBaja = c.FechaBaja,
                            Latitud = c.Latitud,
                            Longitud = c.Longitud,
                            Numero = c.Numero,
                            NumRegistroSanitario = c.NumRegistroSanitario,
                            Observaciones = c.Observaciones,
                            MotivoBaja = c.MotivoBaja,
                            
                            MapaValidado = c.MapaValidado,
                        };

            return await query.ToListAsync();
        }

        public async Task ReactivarCentroAsync(int id)
        {
            var centro = await _context.CentrosConcertados.FindAsync(id);
            if (centro != null)
            {
                centro.FechaBaja = null;
                _context.CentrosConcertados.Update(centro);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<CentrosConcertadoDTO> CreateCentroAsync(CentrosConcertadoDTO dto)
        {
            // Creamos una nueva entidad basada en el modelo de la BD
            var nuevoCentro = new MZAsistencial.Server.Models.CentrosConcertado 
            {
                CodigoMz = dto.Ccn,
                Cifnif = dto.Cif,
                Centro = dto.Centro,
                Direccion = dto.Direccion,
                Cp = dto.CP,
                PoblacionId = dto.PoblacionId,
                ProveedorId = dto.ProveedorId,
                DelegacionId = dto.DelegacionId,
                Telefono = dto.Telefono,
                FechaAlta = dto.FechaAlta ?? DateTime.Now, // Si no viene fecha, ponemos la de hoy
                FechaBaja = dto.FechaBaja,
                Latitud = dto.Latitud,
                Longitud = dto.Longitud,
                Numero = dto.Numero,
                NumRegistroSanitario = dto.NumRegistroSanitario,
                Observaciones = dto.Observaciones,
                MotivoBaja = dto.MotivoBaja,
                MapaValidado = dto.MapaValidado
            };

            _context.CentrosConcertados.Add(nuevoCentro);
            await _context.SaveChangesAsync();

            // Devolvemos el DTO con el nuevo ID autogenerado por SQL
            dto.Centro_id = nuevoCentro.CentroId;
            return dto;
        }

        public async Task<bool> UpdateCentroAsync(int id, CentrosConcertadoDTO dto)
        {
            // Buscamos el centro existente
            var centroExistente = await _context.CentrosConcertados.FindAsync(id);
            if (centroExistente == null) return false;

            // Actualizamos solo los campos que nos interesan
            centroExistente.CodigoMz = dto.Ccn;
            centroExistente.Cifnif = dto.Cif;
            centroExistente.Centro = dto.Centro;
            centroExistente.Direccion = dto.Direccion;
            centroExistente.Cp = dto.CP;
            
            // IDs de los desplegables
            centroExistente.PoblacionId = dto.PoblacionId;
            centroExistente.ProveedorId = dto.ProveedorId;
            centroExistente.DelegacionId = dto.DelegacionId;
            
            // Resto de la ficha
            centroExistente.FechaAlta = dto.FechaAlta;
            centroExistente.FechaBaja = dto.FechaBaja;
            centroExistente.Latitud = dto.Latitud;
            centroExistente.Longitud = dto.Longitud;
            centroExistente.Telefono = dto.Telefono?.Trim();
            centroExistente.Numero = dto.Numero?.Trim();
            centroExistente.NumRegistroSanitario = dto.NumRegistroSanitario;
            centroExistente.Observaciones = dto.Observaciones;
            centroExistente.MotivoBaja = dto.MotivoBaja;
            centroExistente.MapaValidado = dto.MapaValidado;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                var mensajeReal = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                
                throw new Exception($"Fallo SQL: {mensajeReal}"); 
            }
        }

        public async Task<bool> DeleteCentroAsync(int id)
        {
            var centro = await _context.CentrosConcertados.FindAsync(id);
            
            if (centro == null) 
                return false;

            // Ejecuta la baja lógica para mantener la integridad referencial
            centro.FechaBaja = DateTime.Now;

            _context.CentrosConcertados.Update(centro);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<IEnumerable<MutuaAsignadaDTO>> GetMutuasPorCentroAsync(int centroId)
        {
            var mutuasDelCentro = await (
                from c in _context.Conciertos
                join m in _context.Mutuas on c.MutuaId equals m.MutuaId
                where c.CentroId == centroId 
                select new MutuaAsignadaDTO
                {
                    MutuaId = m.MutuaId,
                    Mutua = m.Mutua1,
                    CodigoCasa = c.CodigoCasa,
                    Localizador = c.Localizador
                }
            ).Distinct().ToListAsync();

            return mutuasDelCentro;
        }

        public async Task<IEnumerable<EspecialidadesConciertoDTO>> GetEspecialidadesByCentroAsync(int centroId)
        {
            var query = from v in _context.VwEspecialidadesConciertos
                        where v.CentroId == centroId
                        // Agrupación para unificar las especialidades si el centro tiene varios conciertos
                        group v by new { v.Año, v.Servicio, v.Especialidad } into g
                        // Ordenación por año (el más reciente primero) y luego alfabéticamente
                        orderby g.Key.Año descending, g.Key.Servicio
                        select new EspecialidadesConciertoDTO
                        {
                            Anyo = g.Key.Año,
                            Servicio = g.Key.Servicio ?? "Sin servicio",
                            Especialidad = g.Key.Especialidad ?? "Sin especialidad",
                            Cantidad = g.Sum(x => x.Cantidad ?? 0)
                        };

            return await query.ToListAsync();
        }
    }
}
