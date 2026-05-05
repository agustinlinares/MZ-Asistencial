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
                        join p in _context.AuxPoblaciones on c.PoblacionId equals p.PoblacionId
                        join pr in _context.AuxProvincias on p.ProvinciaId equals pr.ProvinciaId

                        select new CentrosConcertadoDTO
                        {
                            Ccn = c.CodigoMz,      
                            Cif = c.Cifnif,        
                            Centro_id = c.CentroId, 
                            Centro = c.Centro,
                            Direccion = c.Direccion,
                            CP = c.Cp,

                            // Espacios limpios con Trim()
                            Poblacion = p.Poblacion != null ? p.Poblacion.Trim() : null, 
                            Provincia = pr.Provincia != null ? pr.Provincia.Trim() : null, 

                            // IDs necesarios para React
                            ProvinciaId = pr.ProvinciaId, 
                            PoblacionId = c.PoblacionId,
                            ProveedorId = c.ProveedorId,
                            DelegacionId = c.DelegacionId,

                            // Resto de datos de la ficha
                            Telefono = c.Telefono != null ? c.Telefono.Trim() : null,
                            FechaAlta = c.FechaAlta,
                            FechaBaja = c.FechaBaja,
                            Latitud = c.Latitud,
                            Longitud = c.Longitud,
                            
                            Mapa = c.MapaValidado.ToString()
                        };

            return await query.ToListAsync();
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
                Longitud = dto.Longitud
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
            centroExistente.Telefono = dto.Telefono;
            centroExistente.FechaAlta = dto.FechaAlta;
            centroExistente.FechaBaja = dto.FechaBaja;
            centroExistente.Latitud = dto.Latitud;
            centroExistente.Longitud = dto.Longitud;

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
    }
}
